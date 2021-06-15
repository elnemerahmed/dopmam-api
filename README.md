[![Generic badge](https://img.shields.io/badge/contributors-1-<COLOR>.svg)](https://github.com/elnemerahmed/dopmam-api/graphs/contributors)


<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

### Built With
* [Node js](https://nodejs.org/en/)
* [express.js](https://expressjs.com/)
* [jwt](https://jwt.io/)
* [fabric-sdk-node](https://hyperledger.github.io/fabric-sdk-node/)

## Getting Started

### Prerequisites
* Node js
* Code editor
* nodemon

### Installation

1. Clone this repository ```https://github.com/elnemerahmed/dopmam-api```
2. Enter the cloned folder
3. Start new termenal
4. create ```.env``` file by typing ```touch .env```
5. Add the following lines to ```.env```
```
  PORT = {port}
  ACCESS_TOKEN_SECRET = {token}
  CHAINCODE = {chaincode_name}
```
7. Install all project dependencies by typing ```npm install```

## Usage
After successfully installing the requirments and cloning the repository, run ```npm run dev``` script to start using the application.
Note you might need a ```sudo``` if you're trying to access ports less than 1024.

## Roadmap

See the [open issues](https://github.com/elnemerahmed/dopmam-api/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

1. Ahmed El Nemer - ahmedelnemer02@gmail.com

Project Link: [https://github.com/elnemerahmed/dopmam-api](https://github.com/elnemerahmed/dopmam-api)
