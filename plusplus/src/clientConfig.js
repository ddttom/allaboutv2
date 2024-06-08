// Place any Client- Centered Code/  Configuration in here /
import { loadScript } from '/scripts/aem.js';

import { initializeTracker } from './adobe-metadata.js';

import { getConfigTruth } from './variables.js';

function enableDanteChat() {
  window.danteEmbed = `https://chat.dante-ai.com/embed?${window.cmsplus.helpapi}&mode=false&bubble=true&image=null&bubbleopen=false`;
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/bubble-embed.js');
  // eslint-disable-next-line no-undef
  loadScript('https://chat.dante-ai.com/dante-embed.js');
}
export default async function enableTracking() {

//if cookiebot

  if (window.siteConfig?.['$system:cookiebotid$']) {
  // eslint-disable-next-line no-console
    const attrs = {
      id: 'Cookiebot',
      'data-cbid': `${window.siteConfig['$system:cookiebotid$']}`,
      'data-blockingmode': 'auto',
    };
    await loadScript('https://consent.cookiebot.com/uc.js', attrs);
  }

  //if abtasty

  if (window.siteConfig?.['$system:abtastyscript$']) {
    loadScript(`${window.siteConfig['$system:abtastyscript$']}`, {});
  }
  // if tracking, you only get here if allowtracking is set to true

  await loadScript(`${window.siteConfig['$system:trackingscript$']}`, {});

  if ((window.siteConfig?.['$system:allowtracking$']).includes('.adobe')) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    try {
      if (window.cmsplus?.track) {
        if (window.cmsplus.track?.page) {
          window.adobeDataLayer.push(window.cmsplus.track.page);
        }
        if (window.cmsplus.track?.content) {
          window.adobeDataLayer.push(window.cmsplus.track.content);
        }
      }
      //  console.log('Added AdobeDataLayer');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('failed to add cmsplus data to adobeDataLayer', e);
    }
  }

  if ((window.siteConfig?.['$system:allowtracking$']).includes('.googletagmanager')) {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "G-PEWZ87XQN0");
  }
}
export async function initializeClientConfig() {
  window.cmsplus.callbackMetadataTracker = initializeTracker;
  if (getConfigTruth('$system:allowtracking$')) {
    window.cmsplus.callbackPageLoadChain.push(enableTracking);
  }
  if (((window.cmsplus.helpapi) || '').length > 0) {
    window.cmsplus.callbackAfter3SecondsChain.push(enableDanteChat);
  }
}
