import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            {...props}
            src="/company-logo-gray.svg"
            alt="Rus-Korea Driving Center Logo"
            className={`${props.className || ''}`}
        />
    );
}
