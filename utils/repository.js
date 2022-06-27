const { Bitbucket } = require("bitbucket");
const logger = require("./logger");
require("dotenv").config();
const TOKEN = process.env.BITBUCKET_TOKEN;

const clientOptions = {
  auth: {
    token: TOKEN,
  },
};

module.exports = class Repository {
  connection;
  repo = "";
  constructor(r) {
    const [workspace, repo] = r.split("/");
    this.repo = repo;
    this.workspace = workspace;
    this.connection = new Bitbucket(clientOptions);
  }

  connect = () => {};

  getLastCommit = async function (branchName) {
    try {
      const branch = await this.connection.repositories.getBranch({
        repo_slug: this.repo,
        workspace: this.workspace,
        name: branchName,
      });
      return branch.data.target.hash;
    } catch (e) {
      logger.error(e);
    }
  };

  getFile = async function (branchName, fileName) {
    const commit = await this.getLastCommit(branchName);
    try {
      const res = await this.connection.repositories.readSrc({
        repo_slug: this.repo,
        workspace: this.workspace,
        commit: commit,
        path: fileName,
      });
      return res.data;
    } catch (e) {
      logger.error(e);
    }
  };

  createCommit = async function (file, branchName) {
    try {
      const version = Math.round(Math.random() * 1000);
      const res = await this.connection.repositories.createSrcFileCommit({
        repo_slug: this.repo,
        workspace: this.workspace,
        branch: branchName,
        author: "Redocly <info@redocly.com>",
        message: "Update redocly dependencies",
        "package.json": file,
        files: "package.json",
      });
    } catch (e) {
      logger.error(e);
    }
  };

  createBranch = async function (masterBranchName) {
    try {
      const version = Math.round(Math.random() * 1000);
      const branchName = `redocly-deps-update-${version}`;
      await this.connection.repositories.createBranch({
        repo_slug: this.repo,
        workspace: this.workspace,
        _body: {
          name: branchName,
          target: {
            hash: masterBranchName,
          },
        },
      });
      return branchName;
    } catch (e) {
      logger.error(e);
    }
  };

  createPullRequest = async function (masterBranchName, branchName) {
    try {
      await this.connection.repositories.createPullRequest({
        repo_slug: this.repo,
        workspace: this.workspace,
        _body: {
          title: "Updated Redocly Dependecies",
          source: {
            branch: {
              name: branchName,
            },
          },
          destination: {
            branch: {
              name: masterBranchName,
            },
          },
        },
      });
    } catch (e) {
      logger.error(e);
    }
  };
};
