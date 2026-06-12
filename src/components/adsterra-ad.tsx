"use client";

type AdSize = "banner" | "rectangle" | "native";

const ads = {
  mobile: {
    key: "517fe606ffce0d990679e1d29322a61c",
    width: 320,
    height: 50,
  },
  desktop: {
    key: "68ddc298058cb1d6834fef009f6ee4dc",
    width: 728,
    height: 90,
  },
  rectangle: {
    key: "95e6742cbab0e4b4669bff3be7c8ee5e",
    width: 300,
    height: 250,
  },
};

function bannerDocument(key: string, width: number, height: number) {
  return `<!doctype html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;background:transparent;overflow:hidden}</style></head>
<body>
<script>
window.atOptions={key:'${key}',format:'iframe',height:${height},width:${width},params:{}};
</script>
<script src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
</body></html>`;
}

const nativeDocument = `<!doctype html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;background:transparent;overflow:hidden}</style></head>
<body>
<script async data-cfasync="false" src="https://pl29720480.effectivecpmnetwork.com/fd144f8db8245ced90f6cce5912dfcd0/invoke.js"></script>
<div id="container-fd144f8db8245ced90f6cce5912dfcd0"></div>
</body></html>`;

function AdFrame({
  title,
  width,
  height,
  srcDoc,
  className,
}: {
  title: string;
  width: number | string;
  height: number;
  srcDoc: string;
  className?: string;
}) {
  return (
    <iframe
      title={title}
      srcDoc={srcDoc}
      width={width}
      height={height}
      scrolling="no"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      className={className}
    />
  );
}

export function AdsterraAd({ size }: { size: AdSize }) {
  if (size === "native") {
    return (
      <div className="mx-auto w-full max-w-[760px] overflow-hidden">
        <AdFrame
          title="Sponsored content"
          width="100%"
          height={280}
          srcDoc={nativeDocument}
          className="block w-full border-0"
        />
      </div>
    );
  }

  if (size === "rectangle") {
    const ad = ads.rectangle;
    return (
      <AdFrame
        title="Advertisement"
        width={ad.width}
        height={ad.height}
        srcDoc={bannerDocument(ad.key, ad.width, ad.height)}
        className="mx-auto block border-0"
      />
    );
  }

  return (
    <div className="flex min-h-[90px] items-center justify-center overflow-hidden">
      <div className="hidden md:block">
        <AdFrame
          title="Advertisement"
          width={ads.desktop.width}
          height={ads.desktop.height}
          srcDoc={bannerDocument(
            ads.desktop.key,
            ads.desktop.width,
            ads.desktop.height,
          )}
          className="block border-0"
        />
      </div>
      <div className="block md:hidden">
        <AdFrame
          title="Advertisement"
          width={ads.mobile.width}
          height={ads.mobile.height}
          srcDoc={bannerDocument(
            ads.mobile.key,
            ads.mobile.width,
            ads.mobile.height,
          )}
          className="block border-0"
        />
      </div>
    </div>
  );
}
