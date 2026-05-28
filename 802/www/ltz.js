(function () {
    "use strict";

    const STORAGE_KEY = "liuzixin-terminal-settings";
    const STYLE_ID = "liuzixin-terminal-style";

    const config = {
        primary: "#7DF9FF",
        accent: "#FFD166",
        danger: "#FF4D6D",
        base: "#03070A",
        l4Key: "6184",
        userName: "LIU_ZIXIN",
        userUid: "V7.1_FAIRY_CORE",
        name: "劉子新",
        profileTitle: "802 男生列傳 / Fairy System",
        bio: "",
        memos: [
            "6+1 小隊訊號穩定",
            "今日任務：把頁面修得更帥",
            "L4 控制台已上線"
        ],
        tags: [
            { name: "Rokudenashi", url: "https://www.youtube.com/@Rokudenashi_ninzin" },
            { name: "Yorushika", url: "https://www.youtube.com/@nbuna" },
            { name: "yama", url: "https://www.youtube.com/@yama6687" },
            { name: "米津玄師", url: "https://www.youtube.com/@KenshiYonezu" },
            { name: "神山羊", url: "https://www.youtube.com/@yoh_kamiyama" }
        ],
        audio: {
            barCount: 36,
            minHeight: 6,
            maxHeight: 32
        },
        rain: {
            count: 120,
            minSpeed: 1.3,
            maxSpeed: 5.2,
            minLength: 12,
            maxLength: 46,
            minOpacity: 0.08,
            maxOpacity: 0.45,
            forceRadius: 130
        }
    };

    config.bio = `在校園網格中，我大概被歸類為「數理還行」的資優生，但本體是一個極度怕麻煩、隨時處於「精神待機」狀態的甜食中毒者。<br><br>
              我對運動毫無熱愛。比起在太陽下流汗，我更喜歡縮在 <span style="color:${config.primary};">Rokudenashi</span>、Yorushika 或米津玄師的旋律裡。<br><br>
              資源都已經極限特化在 <b style="color:${config.primary};">星見雅 (6+1 特化配置)</b> 身上了。人生可以沒錢，但雅必須滿命。<br><br>
              為了維持我珍貴的待機時間，<span style="font-weight:bold; color:#FF4B4B;">[ 拒絕回答任何學科問題 ]</span>。`;

    const systemLogs = [
        "INIT_PROTOCOL: FAIRY_CORE_READY",
        "DATA_STREAM: SECURE_CHANNEL",
        "AUTH: USER_SIGNATURE_ACCEPTED",
        "DIAGNOSTICS: ALL_SYSTEMS_NOMINAL",
        "VISUAL_ENGINE: FRAME_SYNC_OK",
        "MEMORY_CACHE: PUBLIC_LAYER_UPDATED",
        "SIGNAL_SCAN: LOCAL_FIELD_CLEAR",
        "COMMAND_QUEUE: STANDBY"
    ];

    const syncReplies = [
        "Scanning sector...",
        "Fairy Core synchronized.",
        "Signal is clean.",
        "Security check passed.",
        "Waiting for next command."
    ];

    const aiReplies = [
        "收到。L3 公開資料已保持同步，核心狀態穩定。",
        "這個版本比較乾淨，後面要加照片、音樂或彩蛋會容易很多。",
        "Master，資料流沒有異常。你現在可以繼續改 memos 或 UID。",
        "建議下一步可以把每位同學的介紹都做成同一套小型卡片系統。"
    ];

    const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (char) => entityMap[char]);
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/\x60/g, "&#096;");
    }

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function saveSettings() {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    userName: config.userName,
                    userUid: config.userUid,
                    l4Key: config.l4Key,
                    memos: config.memos
                })
            );
        } catch (error) {
            // Local files can run with storage disabled; the page still works.
        }
    }

    function loadSettings() {
        try {
            const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
            if (!saved || typeof saved !== "object") return;

            if (typeof saved.userName === "string" && saved.userName.trim()) {
                config.userName = saved.userName.trim();
            }

            if (typeof saved.userUid === "string" && saved.userUid.trim()) {
                config.userUid = saved.userUid.trim();
            }

            if (typeof saved.l4Key === "string" && saved.l4Key.trim()) {
                config.l4Key = saved.l4Key.trim();
            }

            if (Array.isArray(saved.memos)) {
                const memos = saved.memos
                    .map((memo) => String(memo).trim())
                    .filter(Boolean)
                    .slice(0, 12);

                if (memos.length) config.memos = memos;
            }
        } catch (error) {
            // Ignore broken storage and use the built-in defaults.
        }
    }

    function speak(text) {
        if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

        window.speechSynthesis.cancel();

        const message = new SpeechSynthesisUtterance(text);
        message.lang = /[\u4e00-\u9fff]/.test(text) ? "zh-TW" : "en-US";
        message.rate = 1;
        message.pitch = 0.82;

        window.speechSynthesis.speak(message);
    }

    function installStyles() {
        const oldStyle = document.getElementById(STYLE_ID);
        if (oldStyle) oldStyle.remove();

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Noto+Sans+TC:wght@400;500;700;900&family=Orbitron:wght@500;700;900&display=swap");

            #liuzixin-intro {
                color-scheme: dark;
            }

            #liuzixin-intro *,
            #liuzixin-intro *::before,
            #liuzixin-intro *::after {
                box-sizing: border-box;
            }

            #cnaly-terminal {
                --lz-primary: ${config.primary};
                --lz-accent: ${config.accent};
                --lz-danger: ${config.danger};
                --lz-font-ui: "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif;
                --lz-font-tech: "Orbitron", "JetBrains Mono", "Courier New", monospace;
                --lz-font-mono: "JetBrains Mono", "Courier New", monospace;
                position: relative;
                width: 100%;
                min-width: 280px;
                height: min(680px, 82vh);
                min-height: 560px;
                max-height: 720px;
                overflow: hidden;
                border: 1px solid rgba(125, 249, 255, 0.38);
                border-radius: 8px;
                background:
                    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 5px),
                    linear-gradient(135deg, rgba(125, 249, 255, 0.09), transparent 28%),
                    linear-gradient(225deg, rgba(255, 209, 102, 0.08), transparent 26%),
                    linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 18%, rgba(0, 0, 0, 0.28) 100%),
                    ${config.base};
                color: var(--lz-primary);
                font-family: var(--lz-font-mono);
                word-break: normal;
                overflow-wrap: normal;
                isolation: isolate;
                cursor: none;
                box-shadow:
                    0 22px 60px rgba(0, 0, 0, 0.34),
                    inset 0 0 42px rgba(125, 249, 255, 0.07);
            }

            #cnaly-terminal::after {
                content: "";
                position: absolute;
                inset: 0;
                z-index: 4;
                background:
                    linear-gradient(90deg, rgba(0, 0, 0, 0.36), transparent 16%, transparent 84%, rgba(0, 0, 0, 0.36)),
                    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 14%, rgba(0, 0, 0, 0.2));
                pointer-events: none;
            }

            #cnaly-terminal button,
            #cnaly-terminal input,
            #cnaly-terminal textarea {
                font: inherit;
            }

            #cnaly-terminal button {
                border-radius: 6px;
            }

            #cnaly-terminal .lz-matrix {
                position: absolute;
                inset: 0;
                z-index: 1;
                opacity: 0.62;
            }

            #cnaly-terminal .lz-grid {
                position: absolute;
                inset: 0;
                z-index: 2;
                background-image:
                    linear-gradient(rgba(125, 249, 255, 0.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(125, 249, 255, 0.06) 1px, transparent 1px);
                background-size: 32px 32px;
                mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.28));
                pointer-events: none;
            }

            #cnaly-terminal .lz-scanline {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 3;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--lz-primary), transparent);
                opacity: 0.4;
                animation: lz-scan 6s linear infinite;
                pointer-events: none;
            }

            #cnaly-terminal .lz-border {
                position: absolute;
                inset: 0;
                z-index: 50;
                border-radius: 8px;
                pointer-events: none;
            }

            #cnaly-terminal .lz-border::before {
                content: "";
                position: absolute;
                inset: 0;
                border-radius: inherit;
                padding: 2px;
                background: conic-gradient(
                    from 0deg,
                    rgba(125, 249, 255, 0.85),
                    transparent 18%,
                    rgba(255, 209, 102, 0.85) 42%,
                    transparent 62%,
                    rgba(255, 77, 109, 0.72) 78%,
                    rgba(125, 249, 255, 0.85)
                );
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                animation: lz-border-spin 12s linear infinite;
            }

            #cnaly-terminal .lz-data {
                position: absolute;
                inset: 0;
                z-index: 15;
                pointer-events: none;
            }

            #cnaly-terminal .lz-ui-text {
                position: absolute;
                max-width: min(320px, 42%);
                color: rgba(195, 252, 255, 0.86);
                font-family: var(--lz-font-mono);
                font-size: 11px;
                line-height: 1.65;
                text-shadow: 0 0 10px rgba(125, 249, 255, 0.32);
            }

            #cnaly-terminal button.lz-ui-text {
                appearance: none;
                border: 0;
                background: transparent;
                text-align: left;
                padding-top: 0;
                padding-bottom: 0;
            }

            #cnaly-terminal .lz-top-left {
                top: 22px;
                left: 22px;
                padding-left: 12px;
                border-left: 3px solid var(--lz-primary);
                pointer-events: auto;
                cursor: pointer;
                filter: drop-shadow(0 0 10px rgba(125, 249, 255, 0.18));
            }

            #cnaly-terminal .lz-top-right {
                top: 22px;
                right: 22px;
                text-align: right;
            }

            #cnaly-terminal .lz-bottom-left {
                left: 22px;
                bottom: 22px;
                width: min(360px, calc(100% - 44px));
                max-width: none;
                max-height: 128px;
                overflow: hidden;
                padding: 12px;
                border: 1px solid rgba(125, 249, 255, 0.18);
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.52);
                box-shadow: inset 0 0 18px rgba(125, 249, 255, 0.04);
            }

            #cnaly-terminal .lz-bottom-right {
                right: 22px;
                bottom: 22px;
                text-align: right;
            }

            #cnaly-terminal .lz-signal {
                position: absolute;
                top: 76px;
                right: 22px;
                z-index: 18;
                width: 112px;
                height: 36px;
                opacity: 0.88;
            }

            #cnaly-terminal .lz-stage {
                position: relative;
                z-index: 20;
                width: 100%;
                height: 100%;
                display: grid;
                place-items: center;
                transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s;
            }

            #cnaly-terminal .lz-stage.is-left {
                transform: translateX(-170px) scale(0.92);
                opacity: 0.55;
            }

            #cnaly-terminal .lz-stage.is-right {
                transform: translateX(170px) scale(0.92);
                opacity: 0.55;
            }

            #cnaly-terminal .lz-core {
                position: relative;
                display: grid;
                place-items: center;
                width: min(280px, 70vw);
                aspect-ratio: 1;
                filter: drop-shadow(0 0 22px rgba(125, 249, 255, 0.18));
            }

            #cnaly-terminal .lz-ring {
                position: absolute;
                inset: 0;
                border: 1px dashed rgba(125, 249, 255, 0.42);
                border-radius: 50%;
                animation: lz-ring-spin 22s linear infinite;
            }

            #cnaly-terminal .lz-ring:nth-child(2) {
                inset: 28px;
                border-color: rgba(255, 209, 102, 0.28);
                animation-duration: 15s;
                animation-direction: reverse;
            }

            #cnaly-terminal .lz-eye {
                position: relative;
                z-index: 2;
                display: grid;
                place-items: center;
                width: 152px;
                height: 152px;
                border: 1px solid rgba(125, 249, 255, 0.55);
                border-radius: 50%;
                background:
                    radial-gradient(circle, rgba(255, 255, 255, 0.55) 0 4%, rgba(125, 249, 255, 0.18) 5% 34%, rgba(0, 0, 0, 0.98) 62%),
                    rgba(0, 0, 0, 0.8);
                box-shadow:
                    0 0 26px rgba(125, 249, 255, 0.34),
                    inset 0 0 22px rgba(125, 249, 255, 0.2),
                    inset 0 -22px 34px rgba(0, 0, 0, 0.38);
                cursor: pointer;
                border-radius: 50%;
                transition: transform 0.18s ease, box-shadow 0.18s ease;
            }

            #cnaly-terminal .lz-eye:hover,
            #cnaly-terminal .lz-eye:focus-visible {
                transform: scale(1.04);
                box-shadow:
                    0 0 34px rgba(125, 249, 255, 0.55),
                    inset 0 0 26px rgba(125, 249, 255, 0.28);
                outline: none;
            }

            #cnaly-terminal .lz-pupil {
                width: 58px;
                height: 58px;
                border-radius: 50%;
                background: var(--lz-primary);
                box-shadow:
                    0 0 30px var(--lz-primary),
                    inset 0 0 18px rgba(255, 255, 255, 0.9);
                transition: transform 0.08s linear;
            }

            #cnaly-terminal .lz-core-command {
                position: absolute;
                left: 50%;
                bottom: -38px;
                z-index: 2;
                min-width: 190px;
                transform: translateX(-50%);
                border: 1px solid rgba(125, 249, 255, 0.42);
                background: rgba(0, 0, 0, 0.54);
                color: var(--lz-primary);
                padding: 9px 14px;
                text-align: center;
                letter-spacing: 0;
                font-family: var(--lz-font-tech);
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
                text-transform: uppercase;
                box-shadow: 0 0 18px rgba(125, 249, 255, 0.14);
                animation: lz-text-pulse 1.8s infinite alternate;
            }

            #cnaly-terminal .lz-visualizer {
                position: absolute;
                inset: 40px;
                border-radius: 50%;
                pointer-events: none;
            }

            #cnaly-terminal .lz-audio-bar {
                position: absolute;
                left: 50%;
                bottom: 50%;
                width: 2px;
                height: 6px;
                border-radius: 999px;
                background: var(--lz-primary);
                opacity: 0.58;
                transform-origin: bottom center;
                transition: height 0.08s ease-out, opacity 0.08s ease-out;
            }

            #cnaly-terminal .lz-panel {
                position: absolute;
                top: 0;
                bottom: 0;
                z-index: 90;
                width: min(420px, 92%);
                display: flex;
                flex-direction: column;
                gap: 18px;
                padding: 42px 34px;
                overflow: hidden;
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 22%),
                    rgba(0, 7, 11, 0.92);
                border-color: rgba(125, 249, 255, 0.32);
                backdrop-filter: blur(14px);
                box-shadow:
                    0 22px 52px rgba(0, 0, 0, 0.42),
                    inset 0 1px 0 rgba(255, 255, 255, 0.08);
                transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
            }

            #cnaly-terminal .lz-panel h2,
            #cnaly-terminal .lz-panel h3 {
                margin: 0;
                color: var(--lz-primary);
                font-family: var(--lz-font-tech);
                line-height: 1.25;
                letter-spacing: 0;
                text-shadow: 0 0 18px rgba(125, 249, 255, 0.32);
            }

            #cnaly-terminal .lz-panel p {
                margin: 0 0 12px;
                color: rgba(239, 254, 255, 0.9);
                font-family: var(--lz-font-ui);
                line-height: 1.75;
                font-size: 14px;
            }

            #cnaly-terminal .lz-panel-actions {
                display: flex;
                gap: 10px;
                margin-top: auto;
                padding-top: 16px;
                border-top: 1px solid rgba(125, 249, 255, 0.18);
            }

            #cnaly-terminal .lz-action {
                flex: 1;
                border: 1px solid rgba(125, 249, 255, 0.52);
                background: rgba(125, 249, 255, 0.08);
                color: var(--lz-primary);
                min-height: 38px;
                padding: 9px 12px;
                font-family: var(--lz-font-tech);
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0;
                cursor: pointer;
                transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
            }

            #cnaly-terminal .lz-action:hover,
            #cnaly-terminal .lz-action:focus-visible {
                background: rgba(125, 249, 255, 0.16);
                border-color: var(--lz-primary);
                transform: translateY(-1px);
                outline: none;
            }

            #cnaly-terminal .lz-action.is-danger {
                border-color: rgba(255, 77, 109, 0.68);
                background: rgba(255, 77, 109, 0.1);
                color: var(--lz-danger);
            }

            #cnaly-terminal .lz-sidebar {
                right: 0;
                border-left: 1px solid rgba(125, 249, 255, 0.28);
                transform: translateX(105%);
            }

            #cnaly-terminal .lz-sidebar.is-active {
                transform: translateX(0);
            }

            #cnaly-terminal .lz-dashboard {
                left: 0;
                border-right: 1px solid rgba(125, 249, 255, 0.28);
                transform: translateX(-105%);
            }

            #cnaly-terminal .lz-dashboard.is-active {
                transform: translateX(0);
            }

            #cnaly-terminal .lz-profile-scroll,
            #cnaly-terminal .lz-chat,
            #cnaly-terminal .lz-memo-grid {
                min-height: 0;
                overflow: auto;
                scrollbar-color: rgba(125, 249, 255, 0.45) rgba(0, 0, 0, 0.2);
            }

            #cnaly-terminal .lz-profile-scroll {
                padding-right: 6px;
                font-family: var(--lz-font-ui);
            }

            #cnaly-terminal .lz-profile-scroll span,
            #cnaly-terminal .lz-profile-scroll b {
                text-shadow: 0 0 14px currentColor;
            }

            #cnaly-terminal .lz-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding-top: 12px;
                border-top: 1px solid rgba(255, 255, 255, 0.09);
            }

            #cnaly-terminal .lz-tag {
                display: inline-flex;
                align-items: center;
                min-height: 30px;
                border: 1px solid rgba(125, 249, 255, 0.34);
                border-radius: 999px;
                padding: 6px 10px;
                color: var(--lz-primary);
                font-family: var(--lz-font-mono);
                text-decoration: none;
                font-size: 11px;
                background: rgba(125, 249, 255, 0.05);
                box-shadow: inset 0 0 10px rgba(125, 249, 255, 0.04);
                transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
            }

            #cnaly-terminal .lz-tag:hover,
            #cnaly-terminal .lz-tag:focus-visible {
                border-color: var(--lz-primary);
                background: rgba(125, 249, 255, 0.14);
                transform: translateY(-1px);
                outline: none;
            }

            #cnaly-terminal .lz-dashboard-meta {
                border: 1px solid rgba(125, 249, 255, 0.18);
                border-radius: 8px;
                padding: 12px;
                color: rgba(195, 252, 255, 0.8);
                font-family: var(--lz-font-mono);
                font-size: 12px;
                line-height: 1.8;
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent),
                    rgba(125, 249, 255, 0.045);
            }

            #cnaly-terminal .lz-memo-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 12px;
                padding-right: 4px;
            }

            #cnaly-terminal .lz-memo-card {
                min-height: 86px;
                border: 1px solid rgba(125, 249, 255, 0.18);
                border-radius: 8px;
                padding: 12px;
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 34%),
                    rgba(125, 249, 255, 0.06);
                color: rgba(239, 254, 255, 0.9);
                font-family: var(--lz-font-ui);
                font-size: 12px;
                line-height: 1.6;
                overflow-wrap: anywhere;
                box-shadow: inset 0 0 18px rgba(125, 249, 255, 0.035);
            }

            #cnaly-terminal .lz-memo-card b {
                display: block;
                margin-bottom: 6px;
                color: var(--lz-accent);
                font-family: var(--lz-font-mono);
                font-size: 11px;
            }

            #cnaly-terminal .lz-private {
                position: absolute;
                inset: 18px;
                z-index: 140;
                display: grid;
                grid-template-columns: 280px minmax(0, 1fr);
                gap: 0;
                overflow: hidden;
                border: 1px solid rgba(255, 209, 102, 0.55);
                border-radius: 8px;
                background:
                    repeating-linear-gradient(90deg, rgba(255, 209, 102, 0.025) 0 1px, transparent 1px 12px),
                    linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 22%),
                    rgba(18, 14, 0, 0.95);
                color: var(--lz-accent);
                opacity: 0;
                pointer-events: none;
                transform: scale(0.98);
                transition: opacity 0.28s ease, transform 0.28s ease;
                backdrop-filter: blur(18px);
                box-shadow:
                    0 28px 64px rgba(0, 0, 0, 0.5),
                    inset 0 0 24px rgba(255, 209, 102, 0.06);
            }

            #cnaly-terminal .lz-private.is-active {
                opacity: 1;
                pointer-events: auto;
                transform: scale(1);
            }

            #cnaly-terminal .lz-private-left,
            #cnaly-terminal .lz-private-right {
                min-width: 0;
                min-height: 0;
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 22px;
            }

            #cnaly-terminal .lz-private-left {
                border-right: 1px solid rgba(255, 209, 102, 0.28);
                overflow: auto;
            }

            #cnaly-terminal .lz-private h3 {
                margin: 0 0 8px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255, 209, 102, 0.28);
                font-family: var(--lz-font-tech);
                font-size: 15px;
                letter-spacing: 0;
            }

            #cnaly-terminal .lz-field-label {
                color: rgba(255, 238, 177, 0.78);
                font-family: var(--lz-font-mono);
                font-size: 11px;
            }

            #cnaly-terminal .lz-field {
                width: 100%;
                border: 1px solid rgba(255, 209, 102, 0.55);
                border-radius: 6px;
                background: rgba(0, 0, 0, 0.55);
                color: var(--lz-accent);
                padding: 9px 10px;
                font-family: var(--lz-font-mono);
                font-size: 12px;
                outline: none;
            }

            #cnaly-terminal .lz-field:focus {
                border-color: var(--lz-accent);
                box-shadow: 0 0 0 2px rgba(255, 209, 102, 0.12);
            }

            #cnaly-terminal textarea.lz-field {
                min-height: 112px;
                resize: vertical;
                line-height: 1.55;
            }

            #cnaly-terminal .lz-gold-action {
                border: 0;
                border-radius: 6px;
                background: var(--lz-accent);
                color: #121000;
                min-height: 40px;
                padding: 10px 12px;
                font-family: var(--lz-font-tech);
                font-weight: 800;
                letter-spacing: 0;
                cursor: pointer;
            }

            #cnaly-terminal .lz-ghost-action {
                border: 1px solid rgba(255, 209, 102, 0.55);
                border-radius: 6px;
                background: transparent;
                color: var(--lz-accent);
                min-height: 40px;
                padding: 10px 12px;
                font-family: var(--lz-font-tech);
                font-weight: 700;
                letter-spacing: 0;
                cursor: pointer;
            }

            #cnaly-terminal .lz-chat {
                flex: 1;
                border: 1px solid rgba(255, 209, 102, 0.22);
                border-radius: 8px;
                padding: 14px;
                background:
                    linear-gradient(180deg, rgba(255, 209, 102, 0.045), transparent 26%),
                    rgba(0, 0, 0, 0.48);
                display: flex;
                flex-direction: column;
                gap: 10px;
                scroll-behavior: smooth;
            }

            #cnaly-terminal .lz-chat-toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                border: 1px solid rgba(255, 209, 102, 0.2);
                border-radius: 8px;
                padding: 9px 10px;
                background: rgba(0, 0, 0, 0.32);
                font-family: var(--lz-font-mono);
                font-size: 11px;
            }

            #cnaly-terminal .lz-chat-status {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: rgba(255, 238, 177, 0.86);
            }

            #cnaly-terminal .lz-chat-status::before {
                content: "";
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #71ffb2;
                box-shadow: 0 0 12px rgba(113, 255, 178, 0.8);
            }

            #cnaly-terminal .lz-chat-clear {
                border: 1px solid rgba(255, 209, 102, 0.34);
                border-radius: 999px;
                background: rgba(255, 209, 102, 0.06);
                color: var(--lz-accent);
                padding: 5px 10px;
                font-family: var(--lz-font-mono);
                font-size: 10px;
                cursor: pointer;
            }

            #cnaly-terminal .lz-chat-clear:hover,
            #cnaly-terminal .lz-chat-clear:focus-visible {
                background: rgba(255, 209, 102, 0.14);
                outline: none;
            }

            #cnaly-terminal .lz-chat-prompts {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            #cnaly-terminal .lz-chat-prompt {
                border: 1px solid rgba(255, 209, 102, 0.26);
                border-radius: 999px;
                background: rgba(255, 209, 102, 0.055);
                color: rgba(255, 238, 177, 0.88);
                min-height: 28px;
                padding: 6px 10px;
                font-family: var(--lz-font-mono);
                font-size: 10px;
                cursor: pointer;
                transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
            }

            #cnaly-terminal .lz-chat-prompt:hover,
            #cnaly-terminal .lz-chat-prompt:focus-visible {
                border-color: rgba(255, 209, 102, 0.55);
                background: rgba(255, 209, 102, 0.12);
                transform: translateY(-1px);
                outline: none;
            }

            #cnaly-terminal .lz-chat-row {
                width: fit-content;
                max-width: 88%;
                border: 1px solid rgba(255, 209, 102, 0.18);
                border-radius: 8px;
                padding: 9px 11px;
                background: rgba(255, 209, 102, 0.055);
                color: rgba(255, 246, 209, 0.92);
                font-family: var(--lz-font-ui);
                font-size: 13px;
                line-height: 1.6;
                overflow-wrap: anywhere;
                box-shadow: inset 0 0 18px rgba(255, 209, 102, 0.025);
            }

            #cnaly-terminal .lz-chat-row.is-user {
                align-self: flex-end;
                border-color: rgba(125, 249, 255, 0.24);
                background: rgba(125, 249, 255, 0.095);
                color: rgba(230, 254, 255, 0.96);
            }

            #cnaly-terminal .lz-chat-row.is-ai {
                align-self: flex-start;
            }

            #cnaly-terminal .lz-chat-row.is-system {
                align-self: center;
                max-width: 100%;
                border-style: dashed;
                background: rgba(255, 209, 102, 0.035);
                color: rgba(255, 238, 177, 0.72);
                text-align: center;
                font-size: 12px;
            }

            #cnaly-terminal .lz-chat-meta {
                margin-bottom: 4px;
                color: rgba(255, 238, 177, 0.58);
                font-family: var(--lz-font-mono);
                font-size: 10px;
            }

            #cnaly-terminal .lz-chat-row.is-user .lz-chat-meta {
                color: rgba(195, 252, 255, 0.62);
            }

            #cnaly-terminal .lz-chat-content {
                min-height: 20px;
            }

            #cnaly-terminal .lz-typing-dots {
                display: inline-grid;
                grid-template-columns: repeat(3, 6px);
                gap: 5px;
                align-items: center;
                min-height: 20px;
            }

            #cnaly-terminal .lz-typing-dots span {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--lz-accent);
                opacity: 0.35;
                animation: lz-dot-pulse 0.9s infinite ease-in-out;
            }

            #cnaly-terminal .lz-typing-dots span:nth-child(2) {
                animation-delay: 0.12s;
            }

            #cnaly-terminal .lz-typing-dots span:nth-child(3) {
                animation-delay: 0.24s;
            }

            #cnaly-terminal .lz-chat-form {
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto;
                gap: 10px;
            }

            #cnaly-terminal #l4-send-btn:disabled {
                cursor: wait;
                opacity: 0.62;
            }

            #cnaly-terminal .lz-particle {
                position: absolute;
                z-index: 200;
                border-radius: 50%;
                background: var(--lz-primary);
                pointer-events: none;
            }

            #cnaly-terminal.is-denied {
                animation: lz-denied 0.36s ease;
            }

            .lz-fairy-cursor {
                position: fixed;
                z-index: 2147483000;
                width: 34px;
                height: 34px;
                pointer-events: none;
                transform: translate(-50%, -50%);
                opacity: 0;
                transition: opacity 0.12s ease;
            }

            .lz-fairy-cursor.is-visible {
                opacity: 1;
            }

            .lz-fairy-cursor__ring {
                position: absolute;
                inset: 0;
                border: 1px dashed ${config.primary};
                border-radius: 50%;
                animation: lz-cursor-spin 4s linear infinite;
            }

            .lz-fairy-cursor__core {
                position: absolute;
                inset: 13px;
                border-radius: 50%;
                background: ${config.primary};
                box-shadow: 0 0 14px ${config.primary};
            }

            @keyframes lz-scan {
                0% { top: 0; }
                50% { top: calc(100% - 2px); }
                100% { top: 0; }
            }

            @keyframes lz-border-spin {
                to { transform: rotate(360deg); }
            }

            @keyframes lz-ring-spin {
                to { transform: rotate(360deg); }
            }

            @keyframes lz-text-pulse {
                from { opacity: 1; }
                to { opacity: 0.55; }
            }

            @keyframes lz-dot-pulse {
                0%, 100% { transform: translateY(0); opacity: 0.28; }
                50% { transform: translateY(-3px); opacity: 0.95; }
            }

            @keyframes lz-cursor-spin {
                to { transform: rotate(360deg); }
            }

            @keyframes lz-denied {
                0%, 100% { filter: none; }
                40% { filter: hue-rotate(130deg) brightness(1.45); }
            }

            @media (max-width: 820px) {
                #cnaly-terminal {
                    height: auto;
                    min-height: 720px;
                    cursor: auto;
                }

                #cnaly-terminal .lz-ui-text {
                    font-size: 10px;
                }

                #cnaly-terminal .lz-top-right,
                #cnaly-terminal .lz-bottom-right,
                #cnaly-terminal .lz-signal {
                    display: none;
                }

                #cnaly-terminal .lz-stage.is-left,
                #cnaly-terminal .lz-stage.is-right {
                    transform: translateY(-120px) scale(0.86);
                    opacity: 0.4;
                }

                #cnaly-terminal .lz-panel {
                    top: auto;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: min(560px, 76%);
                    padding: 28px 22px;
                    border-left: 0;
                    border-right: 0;
                    border-top: 1px solid rgba(125, 249, 255, 0.28);
                    transform: translateY(105%);
                }

                #cnaly-terminal .lz-panel.is-active {
                    transform: translateY(0);
                }

                #cnaly-terminal .lz-memo-grid {
                    grid-template-columns: 1fr;
                }

                #cnaly-terminal .lz-private {
                    inset: 10px;
                    grid-template-columns: 1fr;
                    overflow: auto;
                }

                #cnaly-terminal .lz-private-left {
                    border-right: 0;
                    border-bottom: 1px solid rgba(255, 209, 102, 0.28);
                }

                .lz-fairy-cursor {
                    display: none;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                #cnaly-terminal *,
                #cnaly-terminal *::before,
                #cnaly-terminal *::after,
                .lz-fairy-cursor * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    scroll-behavior: auto !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function makeMarkup() {
        const profileBio = Array.isArray(config.bio)
            ? config.bio.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")
            : String(config.bio);

        const tags = config.tags
            .map((tag) => {
                const name = escapeHtml(tag.name);
                const url = escapeAttr(tag.url);
                return `<a class="lz-tag" href="${url}" target="_blank" rel="noopener noreferrer"># ${name}</a>`;
            })
            .join("");

        return `
            <div id="cnaly-terminal" role="region" aria-label="劉子新互動介紹">
                <canvas class="lz-matrix" id="matrix-rain-canvas" aria-hidden="true"></canvas>
                <div class="lz-grid" aria-hidden="true"></div>
                <div class="lz-scanline" aria-hidden="true"></div>
                <div class="lz-border" aria-hidden="true"></div>
                <canvas class="lz-signal" id="signal-canvas" aria-hidden="true"></canvas>

                <div class="lz-data" aria-hidden="false">
                    <button class="lz-ui-text lz-top-left" id="l3-trigger" type="button" data-action="open-l3">
                        [ LINK_STATUS: ONLINE ]<br>
                        USER: <span id="display-user"></span><br>
                        CORE: <span id="display-uid"></span><br>
                        MEM_USAGE: 78%
                    </button>
                    <div class="lz-ui-text lz-top-right">
                        POS: <span id="pos-display">0,0</span><br>
                        SIGNAL: STABLE
                    </div>
                    <div class="lz-ui-text lz-bottom-left" id="fusion-log"></div>
                    <div class="lz-ui-text lz-bottom-right">
                        ENCRYPTION: RSA_4096<br>
                        AUTH: LOCAL_USER<br>
                        OS_TIME: <span id="os-time"></span>
                    </div>
                </div>

                <div class="lz-stage" id="interactive-layer">
                    <div class="lz-core">
                        <div class="lz-ring" aria-hidden="true"></div>
                        <div class="lz-ring" aria-hidden="true"></div>
                        <div class="lz-visualizer" id="audio-visualizer" aria-hidden="true"></div>
                        <button class="lz-eye" id="eye-box" type="button" data-action="pulse" aria-label="啟動同步核心">
                            <span class="lz-pupil" id="eye-pupil"></span>
                        </button>
                        <button class="lz-core-command" id="core-text" type="button" data-action="open-l2">OPEN_PROFILE</button>
                    </div>
                </div>

                <aside class="lz-panel lz-sidebar" id="l2-sidebar-layer" aria-hidden="true">
                    <header>
                        <h2>${escapeHtml(config.name)}</h2>
                        <p style="color: rgba(195, 252, 255, 0.72); font-size: 12px; margin-top: 8px;">${escapeHtml(config.profileTitle)}</p>
                    </header>
                    <div class="lz-profile-scroll">${profileBio}</div>
                    <div class="lz-tags">${tags}</div>
                    <div class="lz-panel-actions">
                        <button class="lz-action" type="button" data-action="open-l3-from-l2">DASHBOARD</button>
                        <button class="lz-action" type="button" data-action="close-l2">CLOSE</button>
                    </div>
                </aside>

                <aside class="lz-panel lz-dashboard" id="l3-panel" aria-hidden="true">
                    <h3>SYSTEM_DASHBOARD_L3</h3>
                    <div class="lz-dashboard-meta">
                        PUBLIC_VIEW: ENABLED<br>
                        ACCOUNT: <span id="l3-display-user"></span><br>
                        UID: <span id="l3-display-uid"></span>
                    </div>
                    <div class="lz-memo-grid" id="l3-memo-grid"></div>
                    <div class="lz-panel-actions">
                        <button class="lz-action is-danger" type="button" data-action="request-l4">ENTER_L4</button>
                        <button class="lz-action" type="button" data-action="close-l3">BACK</button>
                    </div>
                </aside>

                <section class="lz-private" id="l4-private-layer" aria-hidden="true">
                    <div class="lz-private-left">
                        <h3>CORE_CONTROL_L4</h3>

                        <label class="lz-field-label" for="l4-input-user">USER_NAME</label>
                        <input class="lz-field" id="l4-input-user" type="text" autocomplete="off">

                        <label class="lz-field-label" for="l4-input-uid">SYSTEM_UID</label>
                        <input class="lz-field" id="l4-input-uid" type="text" autocomplete="off">

                        <label class="lz-field-label" for="l4-input-key">L4_KEY</label>
                        <input class="lz-field" id="l4-input-key" type="text" autocomplete="off">

                        <label class="lz-field-label" for="l4-memo-input">MEMOS</label>
                        <textarea class="lz-field" id="l4-memo-input" spellcheck="false"></textarea>

                        <button class="lz-gold-action" type="button" data-action="sync-l4">SYNC_TO_PUBLIC_LAYER</button>
                        <button class="lz-ghost-action" type="button" data-action="exit-l4">EXIT_PRIVATE_SESSION</button>
                    </div>

                    <div class="lz-private-right">
                        <h3>AI_ASSISTANT_CORE</h3>
                        <div class="lz-chat-toolbar">
                            <span class="lz-chat-status">CORE <span id="l4-chat-status">READY</span></span>
                            <button class="lz-chat-clear" type="button" data-action="clear-chat">CLEAR_LOG</button>
                        </div>
                        <div class="lz-chat" id="l4-chat" aria-live="polite">
                            <div class="lz-chat-row is-system">
                                <div class="lz-chat-meta">SYSTEM</div>
                                <div class="lz-chat-content">L4 private layer unlocked. Awaiting command.</div>
                            </div>
                        </div>
                        <div class="lz-chat-prompts">
                            <button class="lz-chat-prompt" type="button" data-action="quick-chat" data-prompt="系統狀態">STATUS</button>
                            <button class="lz-chat-prompt" type="button" data-action="quick-chat" data-prompt="音樂偏好">MUSIC</button>
                            <button class="lz-chat-prompt" type="button" data-action="quick-chat" data-prompt="星見雅">MIYABI</button>
                            <button class="lz-chat-prompt" type="button" data-action="quick-chat" data-prompt="學科問題">POLICY</button>
                        </div>
                        <div class="lz-chat-form">
                            <input class="lz-field" id="l4-chat-input" type="text" placeholder="輸入訊息或使用快速指令..." autocomplete="off" maxlength="180">
                            <button class="lz-gold-action" id="l4-send-btn" type="button" data-action="send-chat">SEND</button>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    function render() {
        const root = document.getElementById("liuzixin-intro");
        if (!root) return;

        if (typeof window.__liuzixinIntroCleanup === "function") {
            window.__liuzixinIntroCleanup();
        }

        loadSettings();
        installStyles();
        root.innerHTML = makeMarkup();

        const state = {
            intervals: [],
            timeouts: new Set(),
            frames: new Set(),
            cleanup: [],
            mouseX: 0,
            mouseY: 0,
            signalOffset: 0,
            chatBusy: false,
            reducedMotion: Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        };

        const $ = (selector) => root.querySelector(selector);
        const terminal = $("#cnaly-terminal");
        const interactiveLayer = $("#interactive-layer");
        const eyeBox = $("#eye-box");
        const eyePupil = $("#eye-pupil");
        const logBox = $("#fusion-log");
        const posDisplay = $("#pos-display");
        const osTimeDisplay = $("#os-time");
        const audioVisualizer = $("#audio-visualizer");
        const sidebar = $("#l2-sidebar-layer");
        const l3Panel = $("#l3-panel");
        const l4Layer = $("#l4-private-layer");
        const memoGrid = $("#l3-memo-grid");
        const chatStatus = $("#l4-chat-status");
        const chatInput = $("#l4-chat-input");
        const chatSendButton = $("#l4-send-btn");
        const matrixCanvas = $("#matrix-rain-canvas");
        const signalCanvas = $("#signal-canvas");
        const matrixCtx = matrixCanvas.getContext("2d");
        const signalCtx = signalCanvas.getContext("2d");

        const cursor = document.createElement("div");
        cursor.className = "lz-fairy-cursor";
        cursor.innerHTML = '<div class="lz-fairy-cursor__ring"></div><div class="lz-fairy-cursor__core"></div>';
        document.body.appendChild(cursor);

        function on(target, eventName, handler, options) {
            target.addEventListener(eventName, handler, options);
            state.cleanup.push(() => target.removeEventListener(eventName, handler, options));
        }

        function setTimer(callback, delay) {
            const id = window.setTimeout(() => {
                state.timeouts.delete(id);
                callback();
            }, delay);
            state.timeouts.add(id);
            return id;
        }

        function setRepeater(callback, delay) {
            const id = window.setInterval(callback, delay);
            state.intervals.push(id);
            return id;
        }

        function requestFrame(callback) {
            const id = window.requestAnimationFrame((time) => {
                state.frames.delete(id);
                callback(time);
            });
            state.frames.add(id);
            return id;
        }

        function appendLog(kind, text) {
            const row = document.createElement("div");
            const label = document.createElement("span");
            label.style.color = "#ffffff";
            label.textContent = `> ${kind}: `;
            row.append(label, document.createTextNode(text));
            logBox.appendChild(row);

            while (logBox.childNodes.length > 6) {
                logBox.removeChild(logBox.firstChild);
            }
        }

        function updatePublicData() {
            $("#display-user").textContent = config.userName;
            $("#display-uid").textContent = config.userUid;
            $("#l3-display-user").textContent = config.userName;
            $("#l3-display-uid").textContent = config.userUid;
            $("#l4-input-user").value = config.userName;
            $("#l4-input-uid").value = config.userUid;
            $("#l4-input-key").value = config.l4Key;
            $("#l4-memo-input").value = config.memos.join("\n");

            memoGrid.innerHTML = config.memos
                .map((memo, index) => `
                    <article class="lz-memo-card">
                        <b>[ MEMO_${String(index + 1).padStart(2, "0")} ]</b>
                        ${escapeHtml(memo)}
                    </article>
                `)
                .join("");
        }

        function setPublicPanel(panelName) {
            const showL2 = panelName === "l2";
            const showL3 = panelName === "l3";

            sidebar.classList.toggle("is-active", showL2);
            l3Panel.classList.toggle("is-active", showL3);
            sidebar.setAttribute("aria-hidden", String(!showL2));
            l3Panel.setAttribute("aria-hidden", String(!showL3));

            interactiveLayer.classList.toggle("is-left", showL2);
            interactiveLayer.classList.toggle("is-right", showL3);
        }

        function setPrivateLayer(isActive) {
            l4Layer.classList.toggle("is-active", isActive);
            l4Layer.setAttribute("aria-hidden", String(!isActive));
        }

        function unlockL4() {
            const key = window.prompt("ENTER_L4_KEY:");

            if (key !== null && key.trim() === config.l4Key) {
                setPrivateLayer(true);
                appendLog("SECURITY", "Private layer unlocked.");
                speak("Private layer unlocked.");
                $("#l4-chat-input").focus();
                return;
            }

            terminal.classList.add("is-denied");
            setTimer(() => terminal.classList.remove("is-denied"), 420);
            appendLog("SECURITY", "ACCESS_DENIED");
            speak("Access denied.");
        }

        function syncL4() {
            const userName = $("#l4-input-user").value.trim();
            const userUid = $("#l4-input-uid").value.trim();
            const l4Key = $("#l4-input-key").value.trim();
            const memos = $("#l4-memo-input").value
                .split(/[\n,，]+/)
                .map((memo) => memo.trim())
                .filter(Boolean)
                .slice(0, 12);

            config.userName = userName || "LIU_ZIXIN";
            config.userUid = userUid || "V7.1_FAIRY_CORE";
            config.l4Key = l4Key || "6184";
            config.memos = memos.length ? memos : ["MEMO_EMPTY"];

            updatePublicData();
            saveSettings();
            appendLog("SYNC", "Public layer refreshed.");
            speak("All core data synchronized.");
        }

        function runTypewriter(target, text) {
            target.textContent = "";

            if (state.reducedMotion) {
                target.textContent = text;
                return Promise.resolve();
            }

            return new Promise((resolve) => {
                let index = 0;

                function step() {
                    target.textContent += text.charAt(index);
                    index += 1;

                    if (index >= text.length) {
                        resolve();
                        return;
                    }

                    setTimer(step, 26);
                }

                step();
            });
        }

        function getChatTime() {
            return new Date().toLocaleTimeString("zh-TW", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });
        }

        function setChatBusy(isBusy) {
            state.chatBusy = isBusy;
            chatStatus.textContent = isBusy ? "THINKING" : "READY";
            chatSendButton.disabled = isBusy;
        }

        function trimChatLog() {
            const chat = $("#l4-chat");
            const rows = Array.from(chat.querySelectorAll(".lz-chat-row"));

            while (rows.length > 34) {
                rows.shift().remove();
            }
        }

        function appendChatRow(kind, text, metaText) {
            const chat = $("#l4-chat");
            const row = document.createElement("div");
            const meta = document.createElement("div");
            const content = document.createElement("div");
            const labels = { ai: "AI", user: "USER", system: "SYSTEM" };

            row.className = `lz-chat-row is-${kind}`;
            meta.className = "lz-chat-meta";
            content.className = "lz-chat-content";
            meta.textContent = metaText || `${labels[kind] || "LOG"} / ${getChatTime()}`;
            content.textContent = text || "";

            row.append(meta, content);
            chat.appendChild(row);
            trimChatLog();
            chat.scrollTop = chat.scrollHeight;

            return content;
        }

        function appendTypingRow() {
            const chat = $("#l4-chat");
            const row = document.createElement("div");
            const meta = document.createElement("div");
            const content = document.createElement("div");

            row.className = "lz-chat-row is-ai";
            meta.className = "lz-chat-meta";
            content.className = "lz-chat-content";
            meta.textContent = `AI / ${getChatTime()}`;
            content.innerHTML = '<span class="lz-typing-dots"><span></span><span></span><span></span></span>';

            row.append(meta, content);
            chat.appendChild(row);
            chat.scrollTop = chat.scrollHeight;

            return row;
        }

        function wait(delay) {
            return new Promise((resolve) => setTimer(resolve, delay));
        }

        function getAiReply(message) {
            const text = String(message);
            const lower = text.toLowerCase();

            if (/狀態|系統|status|core|ready/.test(lower)) {
                return `CORE 狀態：READY。使用者 ${config.userName}，UID ${config.userUid}，L3 memo 共 ${config.memos.length} 筆，訊號穩定。`;
            }

            if (/名字|name|user|profile|自介/.test(lower)) {
                return `PROFILE 已載入：${config.name}。自介內容維持鎖定，不會由 AI 對話框自動改寫。`;
            }

            if (/音樂|music|歌|rokudenashi|yorushika|米津|神山羊|yama/.test(lower)) {
                return "音樂偏好已讀取：Rokudenashi、Yorushika、yama、米津玄師、神山羊。建議播放模式：夜間低亮度，甜食補給，禁止體育課亂入。";
            }

            if (/雅|星見雅|miyabi|6\+1|滿命/.test(lower)) {
                return "MIYABI 模組回應：資源特化方向正確。人生可以沒錢，但雅必須滿命。這條規則已被鎖進核心。";
            }

            if (/學科|作業|功課|數學|英文|理化|考試|題目|問題/.test(lower)) {
                return "偵測到學科問題。依照個人政策：[ 拒絕回答任何學科問題 ]。系統建議：維持精神待機。";
            }

            if (/你好|嗨|hi|hello|hey/.test(lower)) {
                return "嗨，L4 助手在線。可以查狀態、看音樂偏好、呼叫 MIYABI 模組，或只是讓控制台發光一下。";
            }

            return aiReplies[Math.floor(Math.random() * aiReplies.length)];
        }

        function clearChat() {
            if (state.chatBusy) return;

            const chat = $("#l4-chat");
            chat.innerHTML = "";
            appendChatRow("system", "Chat log cleared. Core is ready.", "SYSTEM");
        }

        async function sendChat(messageOverride) {
            if (state.chatBusy) return;

            const value = String(messageOverride || chatInput.value).trim();
            if (!value) return;

            setChatBusy(true);
            appendChatRow("user", value);
            chatInput.value = "";

            const typingRow = appendTypingRow();

            try {
                await wait(state.reducedMotion ? 80 : 430);
                typingRow.remove();

                const target = appendChatRow("ai", "");
                await runTypewriter(target, getAiReply(value));
                $("#l4-chat").scrollTop = $("#l4-chat").scrollHeight;
            } finally {
                setChatBusy(false);
                chatInput.focus();
            }
        }

        function createParticles(x, y) {
            const count = state.reducedMotion ? 4 : 14;

            for (let index = 0; index < count; index += 1) {
                const particle = document.createElement("div");
                const size = randomBetween(2, 6);
                const angle = randomBetween(0, Math.PI * 2);
                const distance = randomBetween(22, 72);
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                particle.className = "lz-particle";
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                terminal.appendChild(particle);

                const animation = particle.animate(
                    [
                        { transform: "translate(0, 0) scale(1)", opacity: 0.95 },
                        { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                    ],
                    { duration: state.reducedMotion ? 220 : 780, easing: "ease-out" }
                );

                animation.onfinish = () => particle.remove();
            }
        }

        function buildAudioBars() {
            const bars = [];

            for (let index = 0; index < config.audio.barCount; index += 1) {
                const bar = document.createElement("div");
                const angle = (index / config.audio.barCount) * 360;
                bar.className = "lz-audio-bar";
                bar.style.transform = `rotate(${angle}deg) translateY(-98px)`;
                audioVisualizer.appendChild(bar);
                bars.push(bar);
            }

            return bars;
        }

        const audioBars = buildAudioBars();
        let audioInterval = null;

        function stopAudioVisualizer() {
            if (audioInterval) {
                window.clearInterval(audioInterval);
                audioInterval = null;
            }

            audioBars.forEach((bar) => {
                bar.style.height = `${config.audio.minHeight}px`;
                bar.style.opacity = "0.58";
            });
        }

        function startAudioVisualizer() {
            stopAudioVisualizer();

            audioInterval = window.setInterval(() => {
                audioBars.forEach((bar) => {
                    bar.style.height = `${randomBetween(config.audio.minHeight, config.audio.maxHeight)}px`;
                    bar.style.opacity = String(randomBetween(0.52, 1));
                });
            }, 92);

            setTimer(stopAudioVisualizer, 2200);
        }

        function syncPulse() {
            const reply = syncReplies[Math.floor(Math.random() * syncReplies.length)];
            startAudioVisualizer();
            appendLog("SYSTEM", reply);
            speak(reply);
        }

        function resizeCanvas(canvas, context) {
            const rect = canvas.getBoundingClientRect();
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            const width = Math.max(1, Math.floor(rect.width * ratio));
            const height = Math.max(1, Math.floor(rect.height * ratio));

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                context.setTransform(ratio, 0, 0, ratio, 0, 0);
            }

            return { width: rect.width, height: rect.height };
        }

        const rainDrops = [];

        function createDrop(width, height, isInitial) {
            return {
                x: Math.random() * width,
                y: isInitial ? Math.random() * height : -randomBetween(20, 70),
                length: randomBetween(config.rain.minLength, config.rain.maxLength),
                speed: randomBetween(config.rain.minSpeed, config.rain.maxSpeed),
                opacity: randomBetween(config.rain.minOpacity, config.rain.maxOpacity)
            };
        }

        function resetRain() {
            const size = resizeCanvas(matrixCanvas, matrixCtx);
            const count = state.reducedMotion ? Math.floor(config.rain.count / 3) : config.rain.count;
            rainDrops.length = 0;

            for (let index = 0; index < count; index += 1) {
                rainDrops.push(createDrop(size.width, size.height, true));
            }
        }

        function drawSignal() {
            const size = resizeCanvas(signalCanvas, signalCtx);
            signalCtx.clearRect(0, 0, size.width, size.height);
            signalCtx.strokeStyle = config.primary;
            signalCtx.lineWidth = 2;
            signalCtx.beginPath();

            for (let x = 0; x <= size.width; x += 2) {
                const wave = Math.sin((x + state.signalOffset) * 0.16) * 8;
                const noise = state.reducedMotion ? 0 : randomBetween(-2, 2);
                const y = size.height / 2 + wave + noise;

                if (x === 0) signalCtx.moveTo(x, y);
                else signalCtx.lineTo(x, y);
            }

            signalCtx.stroke();
            state.signalOffset += state.reducedMotion ? 0.35 : 1;
            requestFrame(drawSignal);
        }

        function drawMatrixRain() {
            const size = resizeCanvas(matrixCanvas, matrixCtx);
            matrixCtx.clearRect(0, 0, size.width, size.height);
            matrixCtx.lineCap = "round";

            rainDrops.forEach((drop) => {
                const dx = state.mouseX - drop.x;
                const dy = state.mouseY - drop.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                let speedMultiplier = 1;
                let xOffset = 0;
                let width = 1;

                if (distance < config.rain.forceRadius) {
                    const forceRatio = 1 - distance / config.rain.forceRadius;
                    speedMultiplier = 0.12 + (1 - forceRatio) * 0.88;
                    xOffset = dx > 0 ? -forceRatio * 24 : forceRatio * 24;
                    width = 1 + forceRatio * 2.4;
                }

                drop.y += drop.speed * speedMultiplier;

                matrixCtx.beginPath();
                matrixCtx.lineWidth = width;
                matrixCtx.strokeStyle = `rgba(125, 249, 255, ${drop.opacity})`;
                matrixCtx.moveTo(drop.x + xOffset, drop.y);
                matrixCtx.lineTo(drop.x + xOffset, drop.y + drop.length);
                matrixCtx.stroke();

                if (drop.y > size.height + drop.length) {
                    Object.assign(drop, createDrop(size.width, size.height, false));
                }
            });

            requestFrame(drawMatrixRain);
        }

        function handleMove(event) {
            const terminalRect = terminal.getBoundingClientRect();
            state.mouseX = event.clientX - terminalRect.left;
            state.mouseY = event.clientY - terminalRect.top;

            if (
                state.mouseX >= 0 &&
                state.mouseX <= terminalRect.width &&
                state.mouseY >= 0 &&
                state.mouseY <= terminalRect.height
            ) {
                posDisplay.textContent = `${Math.round(state.mouseX)},${Math.round(state.mouseY)}`;
            }

            const eyeRect = eyeBox.getBoundingClientRect();
            const dx = event.clientX - (eyeRect.left + eyeRect.width / 2);
            const dy = event.clientY - (eyeRect.top + eyeRect.height / 2);
            const angle = Math.atan2(dy, dx);
            const distance = Math.min(28, Math.hypot(dx, dy) / 6);

            eyePupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            cursor.style.left = `${event.clientX}px`;
            cursor.style.top = `${event.clientY}px`;
        }

        function handleTerminalClick(event) {
            const actionTarget = event.target.closest("[data-action]");
            const privateClick = event.target.closest("#l4-private-layer");

            if (!privateClick) {
                const rect = terminal.getBoundingClientRect();
                createParticles(event.clientX - rect.left, event.clientY - rect.top);
            }

            if (!actionTarget) return;

            const action = actionTarget.dataset.action;

            if (action === "pulse") syncPulse();
            if (action === "open-l2") {
                setPublicPanel("l2");
                appendLog("NAV", "Profile layer opened.");
                speak("Accessing profile.");
            }
            if (action === "close-l2") setPublicPanel(null);
            if (action === "open-l3" || action === "open-l3-from-l2") {
                setPublicPanel("l3");
                appendLog("NAV", "Dashboard layer active.");
                speak("Dashboard active.");
            }
            if (action === "close-l3") setPublicPanel(null);
            if (action === "request-l4") unlockL4();
            if (action === "sync-l4") syncL4();
            if (action === "exit-l4") setPrivateLayer(false);
            if (action === "send-chat") sendChat();
            if (action === "quick-chat") sendChat(actionTarget.dataset.prompt || actionTarget.textContent);
            if (action === "clear-chat") clearChat();
        }

        function handleKeydown(event) {
            if (event.key === "Enter" && event.target === chatInput) {
                event.preventDefault();
                sendChat();
            }

            if (event.key === "Escape") {
                setPrivateLayer(false);
                setPublicPanel(null);
            }
        }

        updatePublicData();
        resetRain();
        drawSignal();
        drawMatrixRain();
        stopAudioVisualizer();

        on(document, "mousemove", handleMove);
        on(document, "keydown", handleKeydown);
        on(terminal, "click", handleTerminalClick);
        on(terminal, "pointerenter", () => cursor.classList.add("is-visible"));
        on(terminal, "pointerleave", () => cursor.classList.remove("is-visible"));

        if ("ResizeObserver" in window) {
            const observer = new ResizeObserver(resetRain);
            observer.observe(terminal);
            state.cleanup.push(() => observer.disconnect());
        } else {
            on(window, "resize", resetRain);
        }

        setRepeater(() => {
            osTimeDisplay.textContent = new Date().toLocaleTimeString("zh-TW", { hour12: false });
        }, 1000);

        let logIndex = 0;
        setRepeater(() => {
            appendLog("LOG", systemLogs[logIndex]);
            logIndex = (logIndex + 1) % systemLogs.length;
        }, 1600);

        appendLog("BOOT", "Interactive profile loaded.");

        window.__liuzixinIntroCleanup = function cleanup() {
            stopAudioVisualizer();
            state.intervals.forEach((id) => window.clearInterval(id));
            state.timeouts.forEach((id) => window.clearTimeout(id));
            state.frames.forEach((id) => window.cancelAnimationFrame(id));
            state.cleanup.forEach((cleanupItem) => cleanupItem());
            cursor.remove();

            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", render, { once: true });
    } else {
        render();
    }
})();
