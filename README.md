# Desktop wallet for Bitcoin Black

## Running betanet wallet
- ```git clone https://github.com/bitcoin-black/desktop-wallet```
- ```cd desktop-wallet/betanet```
- ```yarn install```
- ```yarn electron:start```

Note: Similar steps for mainnet, just change the directory to /mainnet


## Building wallet executable

### Windows
- Assuming you have a running setup after following above steps, you can find ```electron-out``` directory created
- ```cd electron-out/project```
- Run ```yarn package-win64```
- Executable and supporting files will be created in ```release-builds``` folder inside ```electron-out/projects```

Now,

- ```cd release-builds/Bitcoin Black Betanet Wallet-folder/resources```
- Create new folder named **app.asar.unpacked**
- Now, inside **App** directory, copy **ember-electron** directory and paste in **app.asar.unpacked**

Now, let us clean some files.

- Go to App/ember-electron/resources, delete all the executables (.exe) files and linux binary files.
- Go to app.asar.unpacked/ember-electron, delete all files except **resources*** folder. 
- Go to app.asar.unpacked/ember-electron/resources, delete all files except executable files (.exe)
- Go to App/node_modules, delete **.cache** folder.

Now, lets create an installer,

- Copy whole directory, Bitcoin Black Betanet Wallet-folder from release-builds to **Installer/betanet** folder in first level of repository.. 
- Compile NSIS script for betanet
