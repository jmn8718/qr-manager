# QR Manager

## dependencies

- You need an AWS account.
- This project uses [lerna](https://lerna.js.org/) to manage the monorepo.
- This project uses [aws-cdk](https://aws.amazon.com/cdk/) to define and deploy the architecture on *AWS*.


## 0. Configuration

- Install [aws-cli](https://aws.amazon.com/cli/) configure it to interact with aws using *cdk*

## 1.Install dependencies & build the project

- First run `yarn install` to install all dependencies. 
- Then run `yarn build` to build all the packages.
- If you want to build only one package, run `yarn build --scope @qr/<package_name>`

## 2. Deployment

The first time, you need to run `yarn backend:bootstrap` to bootstrap the **aws cdk** infratructure.

Execute `yarn backend:deploy --all` to deploy all the services.
If you only want to deploy some stacks, run `yarn backend:deploy <STACK_NAME>` to deploy the stacks that match the regular expresion *<STACK_NAME>*
