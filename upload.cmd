import os, sys, requests
from github import Github

# config your GitHub account
token = "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"
username = "kingslimes"

# system get files in project
if len(sys.argv) > 1:
    project_dir = sys.argv[1]
else:
    project_dir = "kingslimes.github.io" #input("Enter your project directory: ")
if os.path.isdir( project_dir ):
    project_files = []
    github_contents = []
    for root, directories, files in os.walk(project_dir, topdown=False):
        for name in files:
            project_files.append( os.path.join(root, name) )
    git = Github( token ).get_user( username )
    github_repo = [ repos.name for repos in git.get_repos() ]
    repo = project_dir.split("\\")[-1]
    if project_dir in github_repo:
        github_repo = git.get_repo( project_dir )
        contents = github_repo.get_contents("")
        branch = str(github_repo.get_branch("master")).replace("Branch(name=\"", "").replace("\")", "")
        while contents:
            file_content = contents.pop(0)
            if file_content.type == "dir":
                contents.extend(github_repo.get_contents(file_content.path))
            else:
                file = file_content
                github_contents.append(str(file).replace('ContentFile(path="','').replace('")',''))
        for file in project_files:
            file_name = file.replace(project_dir + "\\", "").replace("\\", "/")

            if file_name in github_contents:
                with open( file, "rb" ) as fs:
                    const = fs.read()
                sha0 = github_repo.get_contents( file_name )
                github_repo.update_file(file_name, "New update", const, sha0.sha, branch=branch)
                print(f"Update file {file_name}")
            else:
                with open( file, "rb" ) as fs:
                    const = fs.read()
                github_repo.create_file(file_name, "New upload", const, branch=branch)
                print(f"Create file {file_name}")
