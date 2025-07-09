# export environment variables from .env
include .env
export

.PHONY: all
all:
	@echo "make install              - install npm dependencies"
	@echo "make build                - compile TypeScript to JavaScript"
	@echo "make watch                - watch for changes and compile"
	@echo "make test                 - run the jest unit tests"
	@echo "make synth                - test CDK stacks with .env variables"
	@echo "make deploy               - deploy the infrastructure"
	@echo "make destroy              - destroy the infrastructure"
	@echo "make clean                - clean build artifacts"

.PHONY: install
install:
	@echo "Installing npm dependencies"
	@npm install

.PHONY: build
build: install
	@echo "Building TypeScript"
	@npm run build

.PHONY: watch
watch: install
	@echo "Watching for changes"
	@npm run watch

.PHONY: test
test: build
	@echo "Running tests"
	@npm test

.PHONY: synth
synth: build
	@echo "Synthesizing CDK stacks"
	@npm run synth

.PHONY: deploy
deploy: build
	@echo "Bootstrapping CDK (if needed)"
	@npm run bootstrap
	@echo "Deploying infrastructure"
	@npm run deploy

.PHONY: destroy
destroy: build
	@echo "Destroying infrastructure"
	@npm run destroy

.PHONY: clean
clean:
	@echo "Cleaning build artifacts"
	@rm -rf lib/
	@rm -rf node_modules/
	@rm -rf cdk.out/