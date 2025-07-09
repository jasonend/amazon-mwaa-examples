# Use AWS CodeArtifact with Amazon MWAA for Python dependencies - TypeScript CDK

This project demonstrates how to create an [Amazon MWAA](https://aws.amazon.com/managed-workflows-for-apache-airflow/) environment that uses [AWS CodeArtifact](https://aws.amazon.com/codeartifact/) for Python dependencies. This enables users to avoid providing MWAA with an internet access via NAT Gateway and hence reduce the cost of their infrastructure.

[AWS Lambda](https://aws.amazon.com/lambda/) runs every 10 hours to obtain the authorization token for AWS CodeArtifact, which is then used to create `index-url` for `pip` remote repository (CodeArtifact repository). Generated `index-url` is saved to `codeartifact.txt` file that is then uploaded to an [Amazon S3](https://aws.amazon.com/s3/) bucket. MWAA fetches DAGs and `codeartifact.txt` at the runtime, and installs Python dependencies from the CodeArtifact repository.

---

## Architecture overview

![Architecture](docs/architecture.png "Architecture")


## Repository structure

```
.
├── lib/                        // TypeScript CDK infrastructure stacks
├── bin/                        // CDK app entry point
├── test/                       // Unit tests
├── mwaa-ca-bucket-content/     // DAGs and requirements.txt
├── lambda/                     // Lambda handler
├── .env                        // Environment variables
├── Makefile                    // Make rules for automation
├── package.json                // Node.js dependencies
├── tsconfig.json               // TypeScript configuration
```

## Deployment

Before moving on with the project deployment, complete the following checks: 

* Install [`Node.js`](https://nodejs.org/) (version 18.x or later) on your machine
* Install [`npm`](https://www.npmjs.com/get-npm) on your machine
* Ensure that [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) is installed and configured on your machine
* Ensure that [AWS CDK](https://aws.amazon.com/cdk/) is [installed and configured](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_prerequisites) on your machine

_**NOTE:** :information_source: This project uses CDK v2, which requires Node.js 18.x or later._

### Install dependencies

To install the necessary dependencies run the following `make` rule:

```sh
# from the root directory

$ make install
```

This rule will install all npm dependencies required for the TypeScript CDK project.

### Environment variables

Set environment variables in `.env` file.

* `AWS_REGION`: AWS region to which you wish to deploy this project
* `BUCKET_NAME`: choose a unique name for an Amazon S3 bucket that will contain Airflow DAGs
* `AIRFLOW_VERSION`: Apache Airflow version (recommended: `2.10.3` or latest supported version)


### Build the project

Execute `build` rule to compile TypeScript:

```sh
# from the root directory

$ make build
```

### Deploy the infrastructure

Execute `deploy` rule to deploy the infrastructure:

```sh
# from the root directory

$ make deploy
```

_**NOTE:** :warning: AWS CDK CLI will ask for your permissions to deploy specific *IAM Roles* and *IAM Polices* resources. When asked, please acknowledge with `y` and press **Enter**._


### Clean up 

To destroy all resources created for this project execute the `destroy` rule:

```sh
# from the root directory

$ make destroy
```

_**NOTE:** :warning: AWS CDK CLI will ask for your permissions to destroy the CDK stacks. When asked, please acknowledge with `y` and press **Enter**._

## Development

### Testing

Run unit tests:

```sh
$ make test
```

### Watch mode

For development, you can run the TypeScript compiler in watch mode:

```sh
$ make watch
```

### Synthesize CloudFormation

To generate CloudFormation templates without deploying:

```sh
$ make synth
```

## Add new Python dependencies

To install preferred Python dependencies to your MWAA environment, update the [`requirements.txt`](mwaa-ca-bucket-content/requirements.txt) file and upload it to S3 bucket. To make these changes take effect, you will need to update your MWAA environment by selecting a new version of `requirements.txt`. You can do so in AWS Console or via AWS CLI.

Upload `requirements.txt` with new Python dependencies:

```sh
aws s3 cp mwaa-ca-bucket-content/requirements.txt s3://YOUR-BUCKET-NAME/
```

To get `requirements.txt` versions run:

```sh
aws s3api list-object-versions --bucket YOUR-BUCKET-NAME --prefix requirements.txt
```

Finally, update your MWAA environment with a new version of `requirements.txt`:

```sh
aws mwaa update-environment --name mwaa_codeartifact_env --requirements-s3-object-version OBJECT_VERSION
```

If you build your own Python packages, you could also add this process to update `requirements.txt` and MWAA environment as part of your [release pipeline](https://docs.aws.amazon.com/codeartifact/latest/ug/using-python-packages-in-codebuild.html).

## Updates Made

This project has been updated to use current AWS tools and runtimes:

- **TypeScript CDK**: Converted from Python CDK to TypeScript CDK v2
- **Modern Project Structure**: Organized with standard TypeScript CDK project layout
- **Node.js 18+**: Uses current Node.js runtime requirements
- **Python 3.12**: Updated Lambda runtime from deprecated Python 3.7 to Python 3.12
- **Airflow 2.10.3**: Updated to latest supported Airflow version
- **Current Operators**: Updated Airflow DAG to use current operators instead of deprecated ones
- **Modern CDK Patterns**: Updated VPC configuration to use current subnet types and IP address configuration
- **Testing Framework**: Added Jest testing framework with sample tests
- **Build System**: Added TypeScript compilation and npm-based build system

## License

This library is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file.