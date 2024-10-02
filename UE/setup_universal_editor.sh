#!/bin/bash

# Setup script for Universal Editor Service and aem-guides-wknd instrumentation

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
if ! command_exists git || ! command_exists mvn || ! command_exists npm; then
  echo "Error: This script requires git, Maven, and npm to be installed."
  exit 1
fi

# Create a new folder and navigate to it
mkdir universal_editor_setup && cd universal_editor_setup

# Clone aem-guides-wknd repository
git clone https://github.com/adobe/aem-guides-wknd.git
cd aem-guides-wknd

# Update customheaderlibs.html
cat << EOF > ui.apps/src/main/content/jcr_root/apps/wknd/components/page/customheaderlibs.html
<sly data-sly-use.clientlib="core/wcm/components/commons/v1/templates/clientlib.html">
    <sly data-sly-call="\${clientlib.css @ categories='wknd.base'}"/>
    <sly data-sly-call="\${clientlib.css @ categories='wknd.page'}"/>
</sly>

<meta property="urn:adobe:aue:system:aemconnection" content="https://localhost:4502"/>
<meta property="urn:adobe:aue:config:service" content="https://localhost:44302"/>
<script src="https://universal-editor-embedded.adobe.net/dist/universal-editor-embedded.js" async></script>
EOF

# Update teaser.html
mkdir -p ui.apps/src/main/content/jcr_root/apps/wknd/components/teaser
cat << EOF > ui.apps/src/main/content/jcr_root/apps/wknd/components/teaser/teaser.html
<div class="cmp-teaser" data-aue-resource="\${resource.path}" data-aue-type="component" data-aue-component="teaser">
    <sly data-sly-use.teaser="com.adobe.cq.wcm.core.components.models.Teaser"
         data-sly-use.templates="core/wcm/components/commons/v1/templates.html"
         data-sly-test.hasContent="\${!teaser.empty}">
        <div class="cmp-teaser__content">
            <h2 class="cmp-teaser__title" data-sly-element="\${teaser.titleType}">
                <a class="cmp-teaser__title-link" href="\${teaser.linkURL}" data-aue-prop="jcr:title" data-aue-type="text">\${teaser.title}</a>
            </h2>
            <div class="cmp-teaser__description" data-aue-prop="jcr:description" data-aue-type="text">\${teaser.description @ context='html'}</div>
            <div class="cmp-teaser__action-container" data-sly-test="\${teaser.actionsEnabled}">
                <a class="cmp-teaser__action-link" data-sly-repeat="\${teaser.actions}" href="\${item.URL}">\${item.title}</a>
            </div>
        </div>
    </sly>
    <sly data-sly-call="\${templates.placeholder @ isEmpty=!hasContent, classAppend='cmp-teaser'}"></sly>
</div>
EOF

# Update title.html
mkdir -p ui.apps/src/main/content/jcr_root/apps/wknd/components/title
cat << EOF > ui.apps/src/main/content/jcr_root/apps/wknd/components/title/title.html
<div class="cmp-title" data-aue-resource="\${resource.path}" data-aue-type="component" data-aue-component="title">
    <h1 class="cmp-title__text" data-aue-prop="jcr:title" data-aue-type="text">\${properties.jcr:title}</h1>
</div>
EOF

# Run Maven build
mvn clean install -PautoInstallPackage

echo "Setup complete. Please ensure you have:"
echo "1. Downloaded and installed the UES and AEM SDK"
echo "2. Started the AEM author instance"
echo "3. Started the Universal Editor Service"
echo "4. Opened and accepted SSL certificates for https://localhost:8000 and https://localhost:44302"
echo "5. Opened a page in the Universal Editor to test the updates"
