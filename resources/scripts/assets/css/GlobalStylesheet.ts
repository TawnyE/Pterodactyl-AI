import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';
// @ts-expect-error untyped font file
import font from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2';

export default createGlobalStyle`
    @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-display: swap;
        font-weight: 100 700;
        src: url(${font}) format('woff2-variations');
        unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
    }

    :root {
        color-scheme: dark;
        --panel-bg: radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 30%),
            radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.12), transparent 26%),
            linear-gradient(180deg, #08111f 0%, #0b1627 45%, #050b14 100%);
        --panel-border: rgba(148, 163, 184, 0.12);
        --panel-shadow: 0 24px 80px rgba(3, 7, 18, 0.45);
    }

    html {
        background: #050b14;
        min-height: 100%;
        scroll-behavior: smooth;
    }

    body {
        ${tw`font-sans text-neutral-200 antialiased`};
        letter-spacing: 0.015em;
        min-height: 100vh;
        background: var(--panel-bg);
        background-attachment: fixed;
        position: relative;
    }

    body::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        background-image: linear-gradient(rgba(148, 163, 184, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.045) 1px, transparent 1px);
        background-size: 72px 72px;
        mask-image: radial-gradient(circle at top, black, transparent 78%);
        opacity: 0.45;
    }

    a,
    button {
        -webkit-tap-highlight-color: transparent;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header text-neutral-50`};
    }

    p {
        ${tw`text-neutral-200 leading-snug font-sans`};
    }

    form {
        ${tw`m-0`};
    }

    ::selection {
        background: rgba(56, 189, 248, 0.35);
        color: white;
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: none;
        width: 16px;
        height: 16px;
    }

    ::-webkit-scrollbar-thumb {
        border: solid 0 rgb(0 0 0 / 0%);
        border-right-width: 4px;
        border-left-width: 4px;
        -webkit-border-radius: 9px 4px;
        -webkit-box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.45), inset 0 0 0 4px rgba(30, 41, 59, 0.92);
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
    }

    ::-webkit-scrollbar-thumb:horizontal {
        border-right-width: 0;
        border-left-width: 0;
        border-top-width: 4px;
        border-bottom-width: 4px;
        -webkit-border-radius: 4px 9px;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }

    @media (prefers-reduced-motion: reduce) {
        html {
            scroll-behavior: auto;
        }

        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;
