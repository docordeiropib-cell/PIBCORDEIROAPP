#!/usr/bin/env python3
"""
PIB Church App Backend API Testing Suite
Tests all endpoints for the Primeira Igreja Batista do Cordeiro app
"""

import requests
import json
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'https://cordeiro-connect.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing PIB Church App APIs at: {API_BASE}")
print("=" * 60)

def test_basic_endpoints():
    """Test basic API endpoints"""
    print("\n🔍 Testing Basic Endpoints")
    print("-" * 30)
    
    # Test root endpoint
    try:
        response = requests.get(f"{API_BASE}/")
        print(f"GET /api/ - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            assert "PIB do Cordeiro API" in data.get("message", "")
            print("✅ Root endpoint working correctly")
        else:
            print(f"❌ Root endpoint failed: {response.text}")
    except Exception as e:
        print(f"❌ Root endpoint error: {str(e)}")
    
    # Test GET status
    try:
        response = requests.get(f"{API_BASE}/status")
        print(f"GET /api/status - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Status checks found: {len(data)}")
            print("✅ GET status endpoint working")
        else:
            print(f"❌ GET status failed: {response.text}")
    except Exception as e:
        print(f"❌ GET status error: {str(e)}")
    
    # Test POST status
    try:
        status_data = {
            "client_name": "Igreja PIB Mobile App"
        }
        response = requests.post(f"{API_BASE}/status", json=status_data)
        print(f"POST /api/status - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Created status check with ID: {data.get('id')}")
            print("✅ POST status endpoint working")
            return data.get('id')
        else:
            print(f"❌ POST status failed: {response.text}")
    except Exception as e:
        print(f"❌ POST status error: {str(e)}")
    
    return None

def test_events_endpoints():
    """Test events management endpoints"""
    print("\n📅 Testing Events Endpoints")
    print("-" * 30)
    
    created_event_id = None
    
    # Test GET all events
    try:
        response = requests.get(f"{API_BASE}/events")
        print(f"GET /api/events - Status: {response.status_code}")
        if response.status_code == 200:
            events = response.json()
            print(f"Events found: {len(events)}")
            for event in events[:2]:  # Show first 2 events
                print(f"  - {event.get('title')} on {event.get('date')}")
            print("✅ GET events endpoint working")
        else:
            print(f"❌ GET events failed: {response.text}")
    except Exception as e:
        print(f"❌ GET events error: {str(e)}")
    
    # Test POST create event
    try:
        future_date = datetime.utcnow() + timedelta(days=7)
        event_data = {
            "title": "Culto de Oração e Jejum",
            "description": "Momento especial de oração e jejum pela igreja e comunidade",
            "date": future_date.isoformat(),
            "time": "19:30",
            "location": "Igreja PIB do Cordeiro",
            "type": "culto"
        }
        response = requests.post(f"{API_BASE}/events", json=event_data)
        print(f"POST /api/events - Status: {response.status_code}")
        if response.status_code == 200:
            event = response.json()
            created_event_id = event.get('id')
            print(f"Created event: {event.get('title')} with ID: {created_event_id}")
            print("✅ POST events endpoint working")
        else:
            print(f"❌ POST events failed: {response.text}")
    except Exception as e:
        print(f"❌ POST events error: {str(e)}")
    
    # Test GET next event
    try:
        response = requests.get(f"{API_BASE}/events/next")
        print(f"GET /api/events/next - Status: {response.status_code}")
        if response.status_code == 200:
            next_event = response.json()
            if next_event:
                print(f"Next event: {next_event.get('title')} on {next_event.get('date')}")
                print("✅ GET next event endpoint working")
            else:
                print("No upcoming events found")
                print("✅ GET next event endpoint working (no events)")
        else:
            print(f"❌ GET next event failed: {response.text}")
    except Exception as e:
        print(f"❌ GET next event error: {str(e)}")
    
    return created_event_id

def test_prayer_requests_endpoints():
    """Test prayer requests management endpoints"""
    print("\n🙏 Testing Prayer Requests Endpoints")
    print("-" * 30)
    
    created_request_id = None
    
    # Test POST create prayer request
    try:
        prayer_data = {
            "name": "Maria Santos",
            "message": "Peço oração pela saúde da minha família e pela paz em nosso lar",
            "is_public": True
        }
        response = requests.post(f"{API_BASE}/prayer-requests", json=prayer_data)
        print(f"POST /api/prayer-requests - Status: {response.status_code}")
        if response.status_code == 200:
            prayer = response.json()
            created_request_id = prayer.get('id')
            print(f"Created prayer request from {prayer.get('name')} with ID: {created_request_id}")
            print("✅ POST prayer requests endpoint working")
        else:
            print(f"❌ POST prayer requests failed: {response.text}")
    except Exception as e:
        print(f"❌ POST prayer requests error: {str(e)}")
    
    # Test PATCH approve prayer request
    if created_request_id:
        try:
            response = requests.patch(f"{API_BASE}/prayer-requests/{created_request_id}/approve")
            print(f"PATCH /api/prayer-requests/{created_request_id}/approve - Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"Approval result: {result.get('message')}")
                print("✅ PATCH approve prayer request endpoint working")
            else:
                print(f"❌ PATCH approve failed: {response.text}")
        except Exception as e:
            print(f"❌ PATCH approve error: {str(e)}")
    
    # Test GET approved prayer requests
    try:
        response = requests.get(f"{API_BASE}/prayer-requests")
        print(f"GET /api/prayer-requests - Status: {response.status_code}")
        if response.status_code == 200:
            requests_list = response.json()
            print(f"Approved public prayer requests: {len(requests_list)}")
            for req in requests_list[:2]:  # Show first 2 requests
                print(f"  - {req.get('name')}: {req.get('message')[:50]}...")
            print("✅ GET prayer requests endpoint working")
        else:
            print(f"❌ GET prayer requests failed: {response.text}")
    except Exception as e:
        print(f"❌ GET prayer requests error: {str(e)}")
    
    # Test PATCH answer prayer request
    if created_request_id:
        try:
            testimony = "Deus respondeu nossa oração! A família está bem e há paz em nosso lar. Glória a Deus!"
            response = requests.patch(f"{API_BASE}/prayer-requests/{created_request_id}/answer", 
                                    params={"testimony": testimony})
            print(f"PATCH /api/prayer-requests/{created_request_id}/answer - Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"Answer result: {result.get('message')}")
                print("✅ PATCH answer prayer request endpoint working")
            else:
                print(f"❌ PATCH answer failed: {response.text}")
        except Exception as e:
            print(f"❌ PATCH answer error: {str(e)}")
    
    return created_request_id

def test_reading_plan_endpoints():
    """Test reading plan endpoints"""
    print("\n📖 Testing Reading Plan Endpoints")
    print("-" * 30)
    
    # Test GET full reading plan
    try:
        response = requests.get(f"{API_BASE}/reading-plan")
        print(f"GET /api/reading-plan - Status: {response.status_code}")
        if response.status_code == 200:
            plan = response.json()
            print(f"Reading plan entries: {len(plan)}")
            for entry in plan[:3]:  # Show first 3 entries
                print(f"  Day {entry.get('day')}: {entry.get('book')} {entry.get('chapters')}")
            print("✅ GET reading plan endpoint working")
        else:
            print(f"❌ GET reading plan failed: {response.text}")
    except Exception as e:
        print(f"❌ GET reading plan error: {str(e)}")
    
    # Test GET today's reading
    try:
        response = requests.get(f"{API_BASE}/reading-plan/today")
        print(f"GET /api/reading-plan/today - Status: {response.status_code}")
        if response.status_code == 200:
            today_reading = response.json()
            if today_reading:
                print(f"Today's reading: {today_reading.get('book')} {today_reading.get('chapters')}")
                print("✅ GET today's reading endpoint working")
            else:
                print("No reading plan for today found")
                print("✅ GET today's reading endpoint working (no plan)")
        else:
            print(f"❌ GET today's reading failed: {response.text}")
    except Exception as e:
        print(f"❌ GET today's reading error: {str(e)}")

def test_static_data_endpoints():
    """Test static data endpoints"""
    print("\n📋 Testing Static Data Endpoints")
    print("-" * 30)
    
    # Test GET ministries
    try:
        response = requests.get(f"{API_BASE}/ministries")
        print(f"GET /api/ministries - Status: {response.status_code}")
        if response.status_code == 200:
            ministries = response.json()
            print(f"Ministries available: {len(ministries)}")
            for ministry in ministries:
                print(f"  - {ministry.get('name')} (Leader: {ministry.get('leader')})")
            print("✅ GET ministries endpoint working")
        else:
            print(f"❌ GET ministries failed: {response.text}")
    except Exception as e:
        print(f"❌ GET ministries error: {str(e)}")
    
    # Test GET media links
    try:
        response = requests.get(f"{API_BASE}/media-links")
        print(f"GET /api/media-links - Status: {response.status_code}")
        if response.status_code == 200:
            media = response.json()
            print(f"Media links available:")
            for key, link in media.items():
                print(f"  - {key}: {link}")
            print("✅ GET media links endpoint working")
        else:
            print(f"❌ GET media links failed: {response.text}")
    except Exception as e:
        print(f"❌ GET media links error: {str(e)}")
    
    # Test GET church info
    try:
        response = requests.get(f"{API_BASE}/church-info")
        print(f"GET /api/church-info - Status: {response.status_code}")
        if response.status_code == 200:
            church_info = response.json()
            print(f"Church info:")
            print(f"  - Name: {church_info.get('name')}")
            print(f"  - Address: {church_info.get('address')}")
            print(f"  - Phone: {church_info.get('phone')}")
            print(f"  - Instagram: {church_info.get('instagram')}")
            print("✅ GET church info endpoint working")
        else:
            print(f"❌ GET church info failed: {response.text}")
    except Exception as e:
        print(f"❌ GET church info error: {str(e)}")

def run_all_tests():
    """Run all API tests"""
    print("🏛️ PIB DO CORDEIRO - API TESTING SUITE")
    print("=" * 60)
    
    # Test all endpoint categories
    test_basic_endpoints()
    test_events_endpoints()
    test_prayer_requests_endpoints()
    test_reading_plan_endpoints()
    test_static_data_endpoints()
    
    print("\n" + "=" * 60)
    print("✅ PIB Church App API Testing Complete!")
    print("Check the output above for any failed tests.")

if __name__ == "__main__":
    run_all_tests()