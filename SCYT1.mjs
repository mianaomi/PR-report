"use strict";
import gh from 'parse-github-url'; 
import fs from 'fs';
import readline from "readline-sync";
import { Octokit} from "@octokit/core";

console.log("AUTH TOKEN: ");
let str1 = String(readline.question());
const octokit = new Octokit({
  auth: str1
})
console.log("URL: ");
let str2 = String(readline.question());
const parseURL = gh(str2);

  
  /*
  * pulls list of closed pull requests 
  */
  const pullList = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner: parseURL.owner,
    repo: parseURL.name,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    },
    state: 'closed'
  }
  )

   class pullReq{
    constructor(inputPR){
      this.id = inputPR.id;
      this.title = inputPR.title;
      this.login = inputPR.user.login;
      this.merged_at = inputPR.merged_at;
      this.passedChecks = new Array();
      this.failedChecks = new Array();
      this.allChecks = false;
      this.checksList;
      this.countOfChecks;
    }
  
   static async prConstReplacement(input){
    const pr = new pullReq(input);
    const checks = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}/check-runs', {
      owner: parseURL.owner,
      repo: parseURL.name,
      ref: input.merge_commit_sha,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    pr.checksList = checks.data.check_runs;
    pr.countOfChecks = checks.data.total_count;
    await pr.getPassedChecks();
    await pr.getFailedChecks();
    pr.allChecks = (pr.failedChecks.length == 0 && pr.checksList.length !== 0);
    return pr;
   } 
    
  
  //list
    async getPassedChecks(){     
      for (var jsIndex = 0; jsIndex < this.countOfChecks; jsIndex++){
        if (this.checksList[jsIndex].conclusion == 'success'){
          this.passedChecks.push(this.checksList[jsIndex].name);
        }
    }
    }
    //list
    async getFailedChecks(){
      for (var jsIndex = 0; jsIndex < this.countOfChecks; jsIndex++){
        if (this.checksList[jsIndex].conclusion !== 'success'){
          this.failedChecks.push(this.checksList[jsIndex].name);
        }  
    }
    }
  
  
  
  }

/*
* Iterates through pull request list, if it was merged (merged_at != null) 
* make object with info and add to approved pulls with list
*/
  var pr;
  var prObj;
  const approvedPulls = [];
for (var jsonIndex = 0; jsonIndex < pullList.data.length && approvedPulls.length < 11; jsonIndex++){
  pr = pullList.data[jsonIndex];
  if (pr.merged_at !== null && pr.merge_commit_sha !== null ){ 
    prObj = await pullReq.prConstReplacement(pr);
    approvedPulls.push(prObj);
  }

}


fs.writeFileSync("thing.json", JSON.stringify(approvedPulls, undefined, 1 )); // print to JSON


  
