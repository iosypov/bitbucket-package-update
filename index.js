const yargs = require("yargs");
const { parsePackages, updatePackages } = require("./utils/packages");
const Repository = require("./utils/repository");

const options = yargs
  .usage("Usage: -r <Repository Address>")
  .option("r", {
    alias: "repo",
    describe: "Bitbucket Repository Address",
    type: "string",
    demandOption: true,
  })
  .option("b", {
    alias: "branch",
    describe: "Main branch name",
    type: "string",
  })
  .option("p", {
    alias: "packages",
    describe: "Packages",
    type: "array",
  }).argv;

const packages = parsePackages(options.packages);
const mainBranch = options.branch ?? "master";
(async function () {
  const Repo = new Repository(options.repo);
  const branchName = await Repo.createBranch(mainBranch);
  const file = await Repo.getFile(branchName, "package.json");
  const updatedFile = updatePackages(file, packages);
  await Repo.createCommit(updatedFile, branchName);
  await Repo.createPullRequest(mainBranch, branchName);
})();
