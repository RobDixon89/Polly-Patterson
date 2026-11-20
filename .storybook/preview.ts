import '../src/styles/index.scss';
import { Device } from './../src/cms/utils/media';

const viewport = (
  name: string,
  width: number,
  height: number,
  type: 'mobile' | 'tablet' | 'desktop',
) => ({ name, styles: { width: `${width}px`, height: `${height}px` }, type });

const VIEWPORTS = {
  // The Figma mobile frames
  mobile: viewport('Mobile (375)', Device.Mobile, 812, 'mobile'),
  // $bp-tablet
  tablet: viewport('Tablet (768)', Device.Tablet, 1024, 'tablet'),
  // $bp-tablet-large, `lg`: where the header, Announcement Bar and Hero Banner switch to their desktop layouts
  tabletLarge: viewport(
    'Tablet Large (1024)',
    Device.TabletLarge,
    768,
    'tablet',
  ),
  // $bp-desktop-small, `xl`: four products per row
  desktopSmall: viewport(
    'Desktop Small (1280)',
    Device.DesktopSmall,
    800,
    'desktop',
  ),
  // The Figma desktop frames
  desktop: viewport('Desktop (1920)', Device.ActualDesktop, 1080, 'desktop'),
};

const setAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name: string, value: string) {
  const fixed =
    this instanceof HTMLScriptElement &&
    name === 'src' &&
    /^[A-Za-z]:\//.test(value)
      ? `/@fs/${value}`
      : value;
  setAttribute.call(this, name, fixed);
};

export default {
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: VIEWPORTS,
    },
  },
};

export const decorators = [];
