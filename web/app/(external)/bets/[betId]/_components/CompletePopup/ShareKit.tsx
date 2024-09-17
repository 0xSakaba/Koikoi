"use client";

import Link from "next/link";
import Facebook from "./platforms/facebook.png";
import Share from "./platforms/share.png";
import Snapchat from "./platforms/snapchat.png";
import Telegram from "./platforms/telegram.png";
import X from "./platforms/x.png";
import Image from "next/image";

export function ShareKit({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => navigator.share({ url })}>
        <Image src={Share.src} alt="Share" width={48} height={48} />
      </button>
      <Link
        href={`https://twitter.com/intent/tweet?text=${url}`}
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <Image src={X.src} alt="Share to X" width={48} height={48} />
      </Link>
      <Link
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <Image
          src={Facebook.src}
          alt="Share to Facebook"
          width={48}
          height={48}
        />
      </Link>
      <Link
        href={`https://www.snapchat.com/scan?attachmentUrl=${url}`}
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <Image
          src={Snapchat.src}
          alt="Share to Snapchat"
          width={48}
          height={48}
        />
      </Link>
      <Link
        href={`https://t.me/share/url?url=${url}`}
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <Image
          src={Telegram.src}
          alt="Share to Telegram"
          width={48}
          height={48}
        />
      </Link>
    </div>
  );
}
