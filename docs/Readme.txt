###########
ReadMe
###########
0. Description:
    BrightForce is a vetted curated tech job marketplace web application.

1. Structure:
    The application is divided into 4 clients:
    *talent - supplier client 
    *company- company client (will be refactored to company)
    *main- bundls the company and talent applications
    *admin- admin panel app

    *all of those applications uses the same nodejs exprees server (on heroku) and mongoDB atlas DB
    *In the near future we will implement a shared react components libary
     in order to allow reuse of common components.

2. Development:
    To start development on each of tha apps run:

    +npm run dev-[client_name] (for exmpale "npm run dev-talent")
     this will run both the server and the relevant client (on port 3000)

    Local Testing During Development:
        to run tests during development run:

        +npx cypress open
         afterwards run the relvant tests using cypress GUI

3. git and CICD:

    git methodology:
        there are 2 main branches with infinte lifetime (master and develop)
        and 3 other types of branches we use (feature, release and hotfix).
            feature branches: branched off develop, merged to develop and should be named feature-[feature_name]
            release branches: branched off develop, merged to master and should be named release-[version]
            hotfix branches: branched off master, merged to master and should be named hotfix-[version]
            for more information see: https://nvie.com/posts/a-successful-git-branching-model/

    CICD:
        pushing to develop will build and push to the integration server via bitbucket piplnes
        pushing to master will build and push to the production server via bitbucket piplnes

        *comment: for now no testing is done on the CICD processes, because we are planning to
                    move from heroku to aws. (after the move we will start doing testing on the cloud)

                !imortant: so testing must be done locally for the time being
                this could be done by runing:
                    +npm run build-test-all (this will build all clients and run all tests)
                            OR
                    +npm run run-test-local (if the clients are already built)if the clients are already built)


4. tech stack and tools:
    Front End: react, redux, thunk, antD, bootstrap scss, css modules.
    Back End: node, express, mongoose(ODM), multer(files).
    DB: mongoDB.
    testing: cypress.