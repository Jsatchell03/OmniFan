import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("../lib/ominfan-e31c7-firebase-adminsdk-putlv-d22e1fef1f.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
teamsCollection = db.collection('teams')

def lookup_events():
        api_call = requests.get(f"https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League")
        storage = api_call.json()
        for team in storage["teams"]:
            doc_ref = teamsCollection.document(team["idTeam"])
            doc_ref.set({"teamId": team["idTeam"], "leaugeId": team["idLeague"], "name": team["strTeam"], "colors": [team["strColour1"], team["strColour2"]], "badge": team["strBadge"] })
            print(team["strTeam"])

lookup_events()
print("DONE")