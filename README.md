# Export of awsiamactions.io

[AWS IAM Actions](https://www.awsiamactions.io/) is an amazing resource with a searchable collection of
all of the AWS IAM Actions available.

The only problem is that it [does not have a programmatic access](https://github.com/cooperwalbrun/aws-iam-actions-support/issues/7).

There's no way to download a single JSON file with all of the actions using `curl`. The download is
only available through a browser by clicking the "Save As..." button.

This repository automates this clicking and saves the file in this repository under
[./awsiamactions.json](./awsiamactions.json).

You can now download the file programmatically:

```sh
curl https://raw.githubusercontent.com/moltar/export-awsiamactions/master/awsiamactions.json
```

## Contribute

```sh
## clone
git clone git@github.com:moltar/export-awsiamactions.git
cd export-awsiamactions

fnm use .
corepack enable
npx projen install
```

Run the scraper locally:

```sh
npx projen scrape
```
