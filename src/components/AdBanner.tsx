
import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot?: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export function AdBanner({ adSlot = "1234567890", adFormat = "auto", className = "" }: AdBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run this if Google AdSense is available
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log("Ad push attempted");
      } catch (e) {
        console.error("AdSense error:", e);
      }
    } else {
      console.log("AdSense not available yet");
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} ref={adContainerRef}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      <div className="text-xs text-muted-foreground text-center mt-1">Advertisement</div>
    </div>
  );
}
