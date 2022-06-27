const updatePackages = (file, packages) => {
  let updated = file;
  packages.forEach((package) => {
    const re = new RegExp(`"${package.name}": ".+"`, "i");
    updated = updated.replace(re, `"${package.name}": "${package.version}"`);
  });
  return updated;
};

const parsePackages = (packages) => {
  return packages.map((package) => {
    const [name, version] = package.split("@");
    return { name, version };
  });
};

module.exports = {
  updatePackages,
  parsePackages,
};
