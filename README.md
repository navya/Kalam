##Course Website Assistant for College Professors

A cross Platform Desktop Client which lets Busy Professors create a course Website and regularly update it. Based on Electron-Shell

### Already implemented features
	
	Download zip

	Course Theme System

	Material Theme

	Folder Generation

### Pending features
	
	Add Media Uploads
	
	Push to Github Pages

	SFTP Push(Almost done, only UI integration left)

	Implement Custom pages

	An Android Client

##Project in Alpha - Target Testing Phase (2016 -)

##To run -
 Download the release from [here](https://github.com/navya/Kalam/releases). Installer coming soon. Only Linux binary available. Open a issue if you want to maintain windows and mac release binaries.

##Dev Build Process
	Run the following command on linux. 
	chmod +x build-linux-x64.sh
	./build-linux-x64.sh

	And on Mac

	chmod +x build-darwin-x64.sh
	./build-darwin-x64.sh

	Now you can run the program from kalam executable inside app folder.
	Make changes in the app/resources/default_app(linux) and app/Kalam.app/Contents/Resources/default_app (Mac) to see changes in realtime and run sync_app_with_source-platform.sh before pushing
	IMPORTANT: Manually delete the courses folder generated in the default_app when you upload via FTP
	More Powerful build process coming

##Why is NodeModules folder in the sources:
	Well the nodemodules currently in use are js only modules so distributing it along with the source and app does not require npm to be installed. Its not that large actually and most useless files have been deleted.

##Contributions : 
Please test and open a issue. Before Working on anything major, please check if its already being worked upon.

###Project By - Bhanu Pratap Chaudhary
