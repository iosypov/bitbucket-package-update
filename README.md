This is script for update dependecies in you bitbucker repository.

# Install Dependicies

```
npm install
```

# Change env variables

Make .env file from dist.env

# Run

For run script use command

```
node index.js --repo={repo} --packages=my-package@1.1 --packages=my-package2@1.2 --branch=master
```

- `repo` - name of the repo ({workspace/repo_name})
- `packages` - list of the packcges which we want to update ("{package}@version")
- `branch` (optional) - name of main branch (default = master)
