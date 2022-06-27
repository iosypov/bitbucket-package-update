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
  .option("p", {
    alias: "packages",
    describe: "Packages",
    type: "array",
  }).argv;

const packages = parsePackages(options.packages);

(async function () {
  const Repo = new Repository(options.repo);
  const branchName = await Repo.createBranch("master");
  const file = await Repo.getFile(branchName, "package.json");
  const updatedFile = updatePackages(file, packages);
  await Repo.createCommit(updatedFile, branchName);
  await Repo.createPullRequest("master", branchName);
})();
