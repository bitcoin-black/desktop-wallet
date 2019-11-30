
!define APPNAME "OpenSSL"
!define COMPANYNAME "Bitcoin Black"
!define DESCRIPTION "OpenSSL by Bitcoin Black"

# These three must be integers
!define VERSIONMAJOR 1
!define VERSIONMINOR 0
!define VERSIONBUILD 0

# This is the size (in kB) of all the files copied into "Program Files"
!define INSTALLSIZE 2048
 
RequestExecutionLevel admin ;Require admin rights on NT6+ (When UAC is turned on)
 
InstallDir "$SYSDIR"

# This will be in the installer/uninstaller's title bar
Name "${APPNAME}"
outFile "openssl.exe"

# Just installation page

Page instfiles

!include LogicLib.nsh
!include x64.nsh

!macro VerifyUserIsAdmin
	UserInfo::GetAccountType
	pop $0
	${If} $0 != "admin" ;Require admin rights on NT4+
			messageBox mb_iconstop "Administrator rights required!"
			setErrorLevel 740 ;ERROR_ELEVATION_REQUIRED
			quit
	${EndIf}
!macroend

function .onInit
	setShellVarContext all
	!insertmacro VerifyUserIsAdmin
	SetAutoClose true
functionEnd
 
section "install"
	# Files for the install directory - to build the installer, these should be in the same directory as the install script (this file)
	setOutPath $INSTDIR
	# Disable 64 bit redirection
	${DisableX64FSRedirection}
	# Files added here should be removed by the uninstaller (see section "uninstall")
	file /r "files\*"
sectionEnd