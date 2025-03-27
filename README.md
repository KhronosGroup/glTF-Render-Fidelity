# Render Fidelity Website

The purpose of glTF is to standardize Physically-Based Rendering (PBR) materials such that you can be confident your model will appear as intended in any lighting environment in any renderer. This is a very ambitious goal, as real-time rendering at this level of quality is still very much an area of active research with improvements being made constantly. This site demonstrates where we are on that path to convergence and highlights areas that could still use improvement. We are comparing the most popular real-time web renderers as well as path tracers (a rendering technique that uses far fewer approximations than are required by real-time renderers).

## Getting Started

This webpage was built using [Next.js](https://nextjs.org).

To start developing, first clone this repo. This will download the code and data from the repository and submodules. The LFS Git extension is necessary in order to handle large files.

Then install the node packages using 
```bash 
npm install
``` 

and run the development server using 
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing by modifying the pages in the `app/` folder or their components in `components/` folder. The page auto-updates as you edit files.

To build the website use
```bash
npm run build
```

## Deploy

Push commits to the main branch and automatic actions on the repo will build and deploy the webpage.

## Security 

As of commit [`e982a93`](https://github.com/KhronosGroup/glTF-temp-RF/commit/e982a93cae9dea7756aee347f6b2037a2a282cd7), this repository has two reported vulnerabilities that have been automatically detected by GitHub's Dependabot. 

- [CVE-2025-29927](https://nvd.nist.gov/vuln/detail/CVE-2025-29927) concerns an authorization check bypass vulnerability but the deployment currently does not use any form of authorization.
- [CVE-2025-27789](https://nvd.nist.gov/vuln/detail/CVE-2025-27789) concerns runtime complexity and does not affect the Render Fidelity website.

Future work on this repository will completely address these issues by updating the dependencies.

