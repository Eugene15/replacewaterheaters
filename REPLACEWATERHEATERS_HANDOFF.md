# Replace Water Heaters — project handoff

Updated: 2026-07-27

## Project overview

- Brand: **Wellmade Water Heater Service**
- Production URL: https://replacewaterheaters.com
- `www` URL: https://www.replacewaterheaters.com
- Canonical host: **without `www`**
- Every page canonical must be an absolute self-referencing URL on `https://replacewaterheaters.com`; never use the `www` host in a canonical tag.
- `www` permanently redirects to the same path on the canonical host with HTTP 301.
- The website itself has not been built yet. The repository currently contains the handoff documentation and source logo only, so the production domain may return 404 until a deployable site is added.

## GitHub

- Repository: https://github.com/Eugene15/replacewaterheaters
- Clone URL: `https://github.com/Eugene15/replacewaterheaters.git`
- Default/deployment branch: `main`
- Repository owner: `Eugene15`
- Git author currently used:
  - Name: `Eugene15`
  - Email: `makarenko.evg@gmail.com`

### Set up Git access on another computer

Install Git, then run:

```powershell
git clone https://github.com/Eugene15/replacewaterheaters.git
cd replacewaterheaters
git config user.name "Eugene15"
git config user.email "makarenko.evg@gmail.com"
```

GitHub no longer accepts an account password for command-line pushes. Use one of these methods:

1. **Recommended: Git Credential Manager over HTTPS.** On Windows it is normally installed with Git. Run `git push`; the browser sign-in window will open. Sign in to the GitHub account `Eugene15` and authorize Git Credential Manager.
2. **GitHub CLI:** install `gh`, run `gh auth login`, choose GitHub.com, HTTPS, and browser authentication.
3. **SSH:** add the new computer's public SSH key to the GitHub account and change the remote to `git@github.com:Eugene15/replacewaterheaters.git`.

Verify access without changing anything:

```powershell
git fetch origin
git status
```

Normal push workflow:

```powershell
git add .
git commit -m "Describe the change"
git push origin main
```

## AWS Amplify hosting

- AWS account label: `viberoom.io`
- AWS account ID: `440893644237`
- Region: `us-east-1` (US East, N. Virginia)
- Amplify app name: `replacewaterheaters`
- Amplify app ID: `d3qtr4x0ilx5i7`
- Connected repository: `Eugene15/replacewaterheaters`
- Connected branch: `main`
- Amplify fallback URL: https://main.d3qtr4x0ilx5i7.amplifyapp.com
- Console: https://us-east-1.console.aws.amazon.com/amplify/apps/d3qtr4x0ilx5i7/overview
- Domain settings: https://us-east-1.console.aws.amazon.com/amplify/apps/d3qtr4x0ilx5i7/domains

### Deploy access on another computer

Amplify continuous deployment is connected to GitHub. **A successful push to `main` automatically starts a production deployment.** No local AWS credentials are required for the normal deployment workflow.

To inspect builds or change hosting settings, sign in to the AWS Console account listed above and open the Amplify console link. Do not store AWS passwords, access keys, session cookies, recovery codes, or GitHub tokens in this repository.

If AWS CLI access is needed later, configure it on the new computer using credentials or AWS SSO authorized for account `440893644237`, then verify:

```powershell
aws sts get-caller-identity
aws amplify get-app --region us-east-1 --app-id d3qtr4x0ilx5i7
```

The returned AWS account must be `440893644237` before making changes.

## Domain and DNS

- DNS provider: Cloudflare
- Cloudflare account: `Makarenko.evg@gmail.com's Account`
- Cloudflare account ID: `5a9a466eda64c3fc918215b8668306e2`
- DNS page: https://dash.cloudflare.com/5a9a466eda64c3fc918215b8668306e2/replacewaterheaters.com/dns/records
- SSL certificate: Amplify-managed
- Domain status at handoff: connected and available
- Amplify/CloudFront target: `d1qj0b0ar67q28.cloudfront.net`

Important DNS records used by hosting:

| Host | Type | Target | Cloudflare proxy |
| --- | --- | --- | --- |
| `@` | CNAME (flattened) | `d1qj0b0ar67q28.cloudfront.net` | DNS only |
| `www` | CNAME | `d1qj0b0ar67q28.cloudfront.net` | DNS only |
| `_6fc529d8e7c2d426a94a2edf99b8fb6d` | CNAME | `_8dbdcdef7e10728d5c7ef6ef72d060b1.jkddzztszm.acm-validations.aws` | DNS only |

Do not delete the ACM validation CNAME. It is needed for certificate renewal. Existing MX, SPF, DMARC, `_domainconnect`, and `pay` records are unrelated to the website and must be preserved.

## Redirect configuration

Amplify Hosting has these redirect rules in this order:

```json
[
  {
    "source": "https://www.replacewaterheaters.com",
    "status": "301",
    "target": "https://replacewaterheaters.com"
  },
  {
    "source": "https://www.replacewaterheaters.com/<*>",
    "status": "301",
    "target": "https://replacewaterheaters.com/<*>"
  },
  {
    "source": "/<*>",
    "status": "404-200",
    "target": "/index.html"
  }
]
```

The rules can be managed at:
https://us-east-1.console.aws.amazon.com/amplify/apps/d3qtr4x0ilx5i7/redirects

## Brand asset

- Source logo: `assets/wellmade-water-heater-logo.png`
- Logo text: **WELLMADE — WATER HEATER SERVICE**
- Primary visual colors: dark navy, vivid blue, white
- The combined `W` and water-drop mark can later be adapted into a favicon and compact mobile logo.

## First tasks on the new computer

1. Clone the repository and authenticate GitHub push access.
2. Build the website in this repository.
3. Add the correct Amplify build configuration for the selected framework.
4. Test locally and commit the production build configuration.
5. Push to `main` and monitor the automatic Amplify build.
6. Verify both `https://replacewaterheaters.com` and the `www` redirect.

## Security note

This handoff intentionally contains resource identifiers and setup instructions, but **no passwords, private keys, access tokens, session cookies, or recovery codes**. Those must be established securely on the new computer through the GitHub, AWS, and Cloudflare sign-in flows.
