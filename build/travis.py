import requests
import time
import sys, os

host = 'https://api.travis-ci.org'
repoId = 28512573
sleetime = 20
headers = {
    "Accept": "application/vnd.travis-ci.2.1+json",
    "Travis-API-Version": "3",
    "Authorization": "token gSE73C-CzWaJ3L2QhgSOrA"
}

def doRequest(method, url, data=None):
    response = requests.request(method, host+url, data=data, headers=headers, verify=False)
    if (response.status_code > 299):
        print ("something went wrong", response.status_code)
        # print (response.content) # can leak data 
    return response.json()

def requestBuild():
    return doRequest("POST", "/repo/bnh6%2Fcryptobox/requests",
        data={"request": {"branch":"master"}} 
    )["request"]["id"]

def getBuildId(requestId):
    while True:
        buildJson = doRequest("GET","/repo/{0}/request/{1}".format (repoId, requestId))
        if buildJson["state"] == "pending":time.sleep(sleetime)
        else: return buildJson["builds"][0]["id"] # TODO check if build failed

def getBuild(buildId):
    buildJson  =  doRequest("GET", "/build/{0}".format (buildId))
    return buildJson["state"], buildJson["finished_at"], [job["id"] for job in  buildJson["jobs"]]

def getLogs(jobId): 
    return doRequest("GET", "/job/{0}/log".format (jobId))["content"]

buildId = getBuildId(requestBuild())
while True:
    state, finishedAt, jobIds = getBuild(buildId)
    if (finishedAt != None): break;
    else: time.sleep(10)

print ("RESULT =",state)
if state == "passed": sys.exit(os.EX_OK)
sys.exit(os.EX_SOFTWARE)