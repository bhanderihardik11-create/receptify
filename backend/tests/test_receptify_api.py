"""Backend API tests for Receptify - hits external preview URL through ingress."""
import os
import time
import io
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Read from frontend .env if not exported
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                    break
    except Exception:
        pass

assert BASE_URL, "REACT_APP_BACKEND_URL not configured"

DEMO_EMAIL = "demo@receptify.in"
DEMO_PASS = "Demo@1234"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def auth_session(session):
    r = session.post(f"{BASE_URL}/api/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASS})
    assert r.status_code == 200, f"Demo login failed: {r.status_code} {r.text[:300]}"
    # cookies persist on session automatically
    return session


# --- Health ---
class TestHealth:
    def test_api_health(self, session):
        r = session.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"

    def test_llm_health(self, session):
        r = session.get(f"{BASE_URL}/api/llm/health")
        assert r.status_code == 200
        j = r.json()
        assert j.get("status") == "ok"
        assert j.get("model") == "claude-sonnet-4-5-20250929"


# --- Auth ---
class TestAuth:
    def test_login_demo(self, session):
        r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASS})
        assert r.status_code == 200
        data = r.json()
        # Should return user info
        assert "user" in data or "email" in data or data.get("ok") is True

    def test_login_bad_creds(self, session):
        r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": DEMO_EMAIL, "password": "wrong"})
        assert r.status_code in (400, 401)

    def test_signup_new_user(self, session):
        ts = int(time.time())
        payload = {
            "businessName": f"TEST Biz {ts}",
            "ownerName": "Test Owner",
            "email": f"test+{ts}@receptify.in",
            "password": "Test@1234",
            "businessType": "NBFC",
            "city": "Mumbai",
            "language": "en",
        }
        r = requests.post(f"{BASE_URL}/api/auth/signup", json=payload)
        assert r.status_code in (200, 201), f"Signup failed: {r.status_code} {r.text[:300]}"

    def test_me_authenticated(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200
        data = r.json()
        assert "user" in data or "email" in data

    def test_me_unauthenticated(self):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        # API returns 200 with user:null when no auth cookie
        assert r.status_code == 200
        assert r.json().get("user") is None


# --- Customers ---
class TestCustomers:
    created_id = None

    def test_list_customers(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/customers")
        assert r.status_code == 200
        data = r.json()
        items = data.get("customers") or data.get("data") or data.get("items") or data
        assert isinstance(items, list)
        # Seed expected to have 10
        assert len(items) >= 1

    def test_create_customer(self, auth_session):
        ts = int(time.time())
        payload = {"fullName": f"TEST Cust {ts}", "phone": "9988776655", "email": f"cust+{ts}@test.com"}
        r = auth_session.post(f"{BASE_URL}/api/customers", json=payload)
        assert r.status_code in (200, 201), f"Create failed: {r.status_code} {r.text[:300]}"
        data = r.json()
        cust = data.get("customer") or data.get("data") or data
        TestCustomers.created_id = cust.get("id") or cust.get("_id")
        assert TestCustomers.created_id

    def test_delete_customer(self, auth_session):
        if not TestCustomers.created_id:
            pytest.skip("No created customer")
        r = auth_session.delete(f"{BASE_URL}/api/customers/{TestCustomers.created_id}")
        assert r.status_code in (200, 204)


# --- Campaigns / Templates / Analytics ---
class TestCampaigns:
    def test_list_campaigns(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/campaigns")
        assert r.status_code == 200

    def test_list_calls(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/calls")
        assert r.status_code == 200

    def test_list_templates(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/templates")
        assert r.status_code == 200
        data = r.json()
        items = data.get("templates") or data.get("data") or data
        assert isinstance(items, list)
        assert len(items) >= 9

    def test_analytics(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/analytics")
        assert r.status_code == 200


# --- LLM Script Generation ---
class TestLLMScript:
    def test_generate_script(self, auth_session):
        payload = {
            "purpose": "payment_reminder",
            "business_name": "TEST Biz",
            "business_type": "NBFC",
            "language": "en",
            "tone": "polite",
            "customer_name": "Rahul",
        }
        r = auth_session.post(f"{BASE_URL}/api/scripts/generate", json=payload, timeout=60)
        assert r.status_code == 200, f"Script gen failed: {r.status_code} {r.text[:300]}"
        data = r.json()
        # Look for required 9 fields (fallback should provide them)
        script = data.get("script") or data
        required = ["full_script", "opening", "main_message", "response_handling",
                    "closing", "cta", "short_version", "polite_version", "professional_version"]
        missing = [k for k in required if k not in script]
        assert not missing, f"Missing keys: {missing} in {list(script.keys())}"


# --- Campaign launch + mock calling flow ---
class TestCampaignLifecycle:
    campaign_id = None

    def test_create_and_launch_campaign(self, auth_session):
        # Get some customers
        rc = auth_session.get(f"{BASE_URL}/api/customers")
        assert rc.status_code == 200
        cust_list = rc.json()
        items = cust_list.get("customers") or cust_list.get("data") or cust_list
        if len(items) < 2:
            pytest.skip("Not enough customers")
        cust_ids = [c.get("id") for c in items[:2] if c.get("id")]

        ts = int(time.time())
        payload = {
            "name": f"TEST Campaign {ts}",
            "purpose": "payment_reminder",
            "script": "Hello {customerName}, this is a payment reminder.",
            "voice": "female_hindi",
            "language": "en",
            "customerIds": cust_ids,
            "scheduleType": "immediate",
            "complianceConfirmed": True,
        }
        r = auth_session.post(f"{BASE_URL}/api/campaigns", json=payload)
        assert r.status_code in (200, 201), f"Campaign create failed: {r.status_code} {r.text[:300]}"
        d = r.json()
        camp = d.get("campaign") or d.get("data") or d
        TestCampaignLifecycle.campaign_id = camp.get("id")
        assert TestCampaignLifecycle.campaign_id

        # Launch
        rl = auth_session.post(f"{BASE_URL}/api/campaigns/{TestCampaignLifecycle.campaign_id}/launch")
        assert rl.status_code in (200, 201, 202), f"Launch failed: {rl.status_code} {rl.text[:300]}"

    def test_campaign_calls_progress(self, auth_session):
        if not TestCampaignLifecycle.campaign_id:
            pytest.skip("No campaign")
        time.sleep(6)  # wait for mock engine
        r = auth_session.get(f"{BASE_URL}/api/campaigns/{TestCampaignLifecycle.campaign_id}")
        assert r.status_code == 200
        # Calls listing
        rc = auth_session.get(f"{BASE_URL}/api/calls?campaignId={TestCampaignLifecycle.campaign_id}")
        assert rc.status_code == 200

    def test_delete_campaign(self, auth_session):
        if not TestCampaignLifecycle.campaign_id:
            pytest.skip("No campaign")
        r = auth_session.delete(f"{BASE_URL}/api/campaigns/{TestCampaignLifecycle.campaign_id}")
        assert r.status_code in (200, 204)
