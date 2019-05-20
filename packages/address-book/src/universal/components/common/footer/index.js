import React, { memo, useMemo, useState } from 'react';
import BeansFooter from '@beans/footer';
import { useAppConfig } from '@oneaccount/react-foundations/lib/app-config';

const CLOSE = 'close';
const ALL = 'all';

function Footer() {
  const { getLocalePhrase, config, region } = useAppConfig();
  const [activeAccordion, handleChange] = useState({ action: CLOSE, id: ALL });

  const footerLinks = useMemo(
    () =>
      config[region].footerLinks.map((section, i) => ({
        header: getLocalePhrase(`footer.links.header${i + 1}.title`),
        links: section.links.map((link, j) => ({
          ...link,
          text: getLocalePhrase(`footer.links.header${i + 1}.link${j + 1}`),
        })),
      })),
    [],
  );

  const computedCopyright = useMemo(() => {
    const copyright = getLocalePhrase('footer.copyright', {
      year: new Date().getFullYear(),
    });

    return `${getLocalePhrase('tesco-site')} ${copyright}`;
  }, []);

  return (
    <BeansFooter
      accordion={activeAccordion}
      contentLinks={footerLinks}
      onChange={handleChange}
      socialLinks={config[region].socialLinks}
      followUsText={getLocalePhrase('footer.social-bar.label')}
      copyrightText={computedCopyright}
    />
  );
}

export default memo(Footer);
