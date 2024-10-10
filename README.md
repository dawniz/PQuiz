# <p style="text-align:center">PQuiz

<div style="text-align:center">

![GitHub License](https://img.shields.io/github/license/dawniz/PQuiz)
![StaticBadge](https://img.shields.io/badge/-ReactJS-61DAFB?logo=react&logoColor=black&style=flat)

</div></p>

Simple app based on "Who's that Pokémon?" segment from Pokémon TV Show. Game shows you silhouette of Pokémon and you need to give correct answer. There are 3 types of quizes where answers:
- are presented and you need to choose correct one (choices ABCD)
- need to be typed by hand
- must be selected from presented Pokémon natures

## Navigation

 - [ **Tech Stack** ](#tech-stack)
 - [ **Demo** ](#demo)
 - [ **Getting started** ](#getting-started)
 - [ **Development** ](#development)
 - [ **Environmental variables** ](#environmental-variables)
 - [ **License** ](#license)
 - [ **Credits** ](#credits)
 - [ **Contact** ](#contact)


## Tech Stack

**Client:** built with [React](https://react.dev/), served directly from server, styled with [Tailwind CSS](https://tailwindcss.com/)

**Server:** Node, Express, API created with [PokeApi](https://pokeapi.co/)

**Database:** SQL


## Demo

You can check live demo [here](https://pquiz-dawniz.vercel.app/)


## Getting started

#### 1. Get a local copy of the code, clone it using `git`:

```bash
git clone https://github.com/dawniz/PQuiz.git
cd PQuiz
```

#### 2. Install dependencies(server & client) and go back to root directory:

```bash
npm install && npm run client:install
```

#### 3. Build client's static files

```bash
npm run client:build
```

#### 4. [Fill `.env` variables using `env.template`](#environmental-variables)

#### 5. Start server
```bash
npm start
```
#### 6. Then open http://localhost:[PORT](#environmental-variables) to view it in the browser.

> When started server drops current database, create new one and populate it with new data. Every Sunday database is updated.

## Development

#### 1. Check if you have
- local copy of the code
- dependencies installed for both client and server 
#### 2. [Fill `.env` variables using `env.template`](#environmental-variables), remember about ``ENV`` variable

```env
ENV = "development"
```

#### 3. Start server

```bash
npm run dev
```

#### 4. Start client in separate terminal
```bash
npm run client:start
```

> Server crash when there is lint errors - it's forcing to correct error before continuing

## Environmental variables

| Variable | Value | Comment |
| - | --- | ------ |
| `ENV` | `"production"`  `"development"` | In **production** server is serving builded client files. In **development** you need to start client and server separately |
| `DB_HOST` `DB_USER`  `DB_PASSWORD`  `DB_NAME`   `DB_PORT` | | Your database credentials |
| `PORT` | | Port of your server |
| `DB_CONNECTION_LIMIT`  `DB_MAX_IDLE` | Default: 2 | Number of simultaneously connections and idling one |

## License
Distributed under the MIT License.

## Credits

 - logo generated with [**Pokémon Fonts Generator**](https://pokemon-fonts-generator.netlify.app/)

 - font used in whole project is **VPPixel-Simplified**

 - all Pokémon's sprites are from [**PokeApi**](https://pokeapi.co/), processed and compressed with [**ImageMagick**](https://imagemagick.org/)

## Contact
Dawid Nizioł

mail: [dawid.a.niziol@gmail.com](mailto:dawid.a.niziol@gmail.com)

project link - [https://github.com/dawniz/PQuiz](https://github.com/dawniz/PQuiz)
