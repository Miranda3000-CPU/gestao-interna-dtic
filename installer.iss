; ============================================================
; Inno Setup Script - Gestão Interna DTIC
; ============================================================
; Compilar com: Inno Setup 6.x (https://jrsoftware.org/isinfo.php)
; ============================================================

#define MyAppName "Gestão Interna DTIC"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "DTIC"
#define MyAppURL "http://127.0.0.1:5000"
#define MyAppExeName "GestaoInternaDTIC.exe"

[Setup]
; Identificador único do aplicativo (gere um novo GUID se necessário)
AppId={{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppSupportURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
; Descomente a linha abaixo para pedir aceitação de licença
; LicenseFile=LICENSE
OutputDir=installer_output
OutputBaseFilename=GestaoInternaDTIC_Setup_v{#MyAppVersion}
SetupIconFile=static\icon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
; Permite instalar sem admin
PrivilegesRequiredOverridesAllowed=dialog
ArchitecturesInstallIn64BitMode=x64compatible
DisableProgramGroupPage=yes
UninstallDisplayName={#MyAppName}
; Visual
WizardSizePercent=110
; Descomente para imagem no instalador
; WizardImageFile=static\installer_banner.bmp
; WizardSmallImageFile=static\installer_icon.bmp

[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Criar atalho na Área de Trabalho"; GroupDescription: "Atalhos:"; Flags: checked
Name: "startmenu"; Description: "Criar atalho no Menu Iniciar"; GroupDescription: "Atalhos:"; Flags: checked

[Files]
Source: "dist\GestaoInternaDTIC\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; Dados JSON iniciais (não sobrescreve para preservar dados do usuário)
Source: "voluntarios.json"; DestDir: "{app}"; Flags: onlyifdoesntexist
Source: "militares.json"; DestDir: "{app}"; Flags: onlyifdoesntexist

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Comment: "Abrir Gestão Interna DTIC"
Name: "{group}\Desinstalar {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon; Comment: "Abrir Gestão Interna DTIC"

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Iniciar {#MyAppName} agora"; Flags: nowait postinstall skipifsilent shellexec

[UninstallDelete]
; Remove arquivos de cache do Python ao desinstalar
Type: filesandordirs; Name: "{app}\__pycache__"

[Code]
// Verifica se já existe uma instância rodando e avisa
function InitializeSetup(): Boolean;
begin
  Result := True;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    // Pós-instalação: pode adicionar lógica aqui se necessário
  end;
end;
