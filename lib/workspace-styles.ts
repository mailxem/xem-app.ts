// Shared Tailwind recipes for the workspace and auth screens. No generated CSS file.
// Keep complete utility strings here so Tailwind can discover every variant.
const recipes: Record<string, string> = {
  "document-theme": String.raw`
    [--background:#fff] [--foreground:#202027] [--card:#fff] [--card-foreground:#202027] [--popover:#fff] [--popover-foreground:#202027] [--primary:#6852ed] [--primary-foreground:#fff] [--secondary:#f2f1f7] [--secondary-foreground:#48434f] [--muted:#f6f5f9] [--muted-foreground:#7b7a85] [--accent:#eeebff] [--accent-foreground:#5a43d8] [--border:#eae9ef] [--input:#e7e5ed] [--ring:#8470ee] [--radius:0.7rem] [--sidebar-background:#fff] [--sidebar-foreground:#75727d] [--sidebar-accent:#f4f3f7] [--sidebar-border:#efedf4] [--font-sans:var(--font-geist-sans),_Arial,_sans-serif] [--shadow-sm:0_1px_3px_#20202706] [--shadow:0_2px_8px_#20202706] [--shadow-md:0_4px_18px_#20202707] [--shadow-lg:0_8px_30px_#2020270b] [font-family:var(--font-geist-sans),_Arial,_sans-serif] [background:#e9eaed] [font-size:14px] [--destructive:#c24c64] [--destructive-foreground:#ffffff] [--chart-1:#8064db] [--chart-2:#63a99c] [--chart-3:#d2ad74] [--chart-4:#859ac8] [--chart-5:#bb87b7] [--sidebar-primary:#6852ed] [--sidebar-primary-foreground:#ffffff] [--sidebar-ring:#8470ee]
    [&_p]:[font-family:inherit]
    [&_button]:[-webkit-tap-highlight-color:transparent] [&_button]:cursor-pointer
    [&_a]:[-webkit-tap-highlight-color:transparent]
    [&_input]:[-webkit-tap-highlight-color:transparent]
    [&_select]:[-webkit-tap-highlight-color:transparent]
    [&_textarea]:[-webkit-tap-highlight-color:transparent]
    [&_button:focus-visible]:[outline:2px_solid_#8b77ef] [&_button:focus-visible]:[outline-offset:3px]
    [&_a:focus-visible]:[outline:2px_solid_#8b77ef] [&_a:focus-visible]:[outline-offset:3px]
    [&_button:disabled]:cursor-not-allowed [&_button:disabled]:[opacity:0.5]
    motion-reduce:[&_*]:![scroll-behavior:auto] motion-reduce:[&_*]:![transition:none] motion-reduce:[&_*]:![animation-duration:0.01ms]
    [&_[data-variant="default"]]:[background:linear-gradient(180deg,#8e78ff,#6950ec_50%,#7660f2)] [&_[data-variant="default"]]:[border:1px_solid_#8a73f0] [&_[data-variant="default"]]:[box-shadow:inset_0_1px_2px_#ffffff60,0_3px_7px_#7154dc12] [&_[data-variant="default"]]:[color:white] [&_[data-variant="default"]]:[border-radius:9px]
    [&_[data-variant="default"]:hover]:[filter:brightness(1.035)]
    [&_[data-variant="outline"]]:[border-color:#e5dfec] [&_[data-variant="outline"]]:[background:white] [&_[data-variant="outline"]]:[color:#75657f] [&_[data-variant="outline"]]:[border-radius:9px] [&_[data-variant="outline"]]:[box-shadow:0_1px_2px_#34203e04]
    [&_[data-size="default"]]:[min-height:40px] [&_[data-size="default"]]:[font-size:12px] [&_[data-size="default"]]:font-medium
    [&_[data-slot="input"]]:[border-color:#e5e0ea] [&_[data-slot="input"]]:[background:white] [&_[data-slot="input"]]:[color:#403447] [&_[data-slot="input"]]:[font-size:13px] [&_[data-slot="input"]]:[box-shadow:0_1px_2px_#30203903]
    [&_[data-slot="table"]_th]:[font-size:11px] [&_[data-slot="table"]_th]:font-medium [&_[data-slot="table"]_th]:[color:#988aa2] [&_[data-slot="table"]_th]:[background:#f8f6fa] [&_[data-slot="table"]_th]:[height:45px]
    [&_[data-slot="table"]_td]:[font-size:12px] [&_[data-slot="table"]_td]:[color:#706278] [&_[data-slot="table"]_td]:[padding-top:17px] [&_[data-slot="table"]_td]:[padding-bottom:17px] [&_[data-slot="table"]_td]:[border-color:#f0ebf4]
    [&_[data-slot="table"]_tbody_tr:hover]:[background-color:#faf7fd]
  `,
  "product-frame": String.raw`
    flex [min-height:0] [border-radius:24px] [background:#f7f6fa] overflow-hidden [border:1px_solid_#ffffffb3] [box-shadow:0_10px_70px_#25253003] [height:100dvh] [max-height:100dvh]
    max-[1100px]:[margin:0] max-[1100px]:[border:0] max-[1100px]:[border-radius:0] max-[1100px]:[min-height:0] max-[1100px]:[width:100%]
  `,
  "product-sidebar": String.raw`
    [width:238px] shrink-0 [background:#fdfcfe] flex flex-col [padding:28px_20px_16px] [border-right:1px_solid_#f3f1f7] relative [top:0] [align-self:flex-start] [height:100%] overflow-y-auto [scrollbar-width:thin]
    min-[1500px]:[width:250px]
    max-[1100px]:[width:205px] max-[1100px]:[height:100svh] max-[1100px]:[padding:24px_14px]
    max-[780px]:hidden
    [&_nav]:[flex:1]
  `,
  "brand": String.raw`
    flex items-center [gap:11px] [font-size:23px] [letter-spacing:-0.8px] font-semibold [margin:0_0_33px_3px]
  `,
  "brand-icon": String.raw`
    grid [place-items:center] [width:36px] [height:36px] [border-radius:10px] [background:#6851f0] [color:white] [box-shadow:inset_0_1px_2px_#fff8]
  `,
  "collapse-sidebar": String.raw`
    [margin-left:auto] [color:#9a97a2]
  `,
  "product-nav-item": String.raw`
    [height:44px] [padding:0_12px] flex items-center [gap:12px] [color:#77737f] [border:1px_solid_transparent] [border-radius:9px] [margin:3px_0] [font-size:14px] [transition:background_0.15s]
    [&:hover]:[background:#f7f5fb] [&:hover]:[color:#383240]
    [&.active]:[color:#26232d] [&.active]:[background:#f3f2f7] [&.active]:[border-color:#eae7f0] [&.active]:[font-weight:550] [&.active]:[box-shadow:0_1px_2px_#30263b02]
    [&.active_svg]:[color:#6b50e8]
    [&_small]:[font-size:8px] [&_small]:[letter-spacing:0.7px] [&_small]:[padding:2px_4px] [&_small]:[border:1px_solid_#e5dff9] [&_small]:[border-radius:4px] [&_small]:[color:#9282c3] [&_small]:[margin-left:auto]
    min-[1500px]:[height:47px]
  `,
  "sidebar-bottom": String.raw`
    [margin-top:auto] [padding-top:26px]
  `,
  "workspace-note": String.raw`
    [padding:20px_10px_25px] [color:#aaa4b6] [font-size:11px] [line-height:1.8]
    [&_strong]:font-normal [&_strong]:[color:#928a9d]
  `,
  "workspace-dot": String.raw`
    inline-block [background:#ad9deb] [width:5px] [height:5px] [border-radius:50%] [margin-right:5px]
  `,
  "workspace-user": String.raw`
    flex [gap:10px] items-center [width:100%] [border-top:1px_solid_#eae7ee] [padding:20px_4px_0] text-left
    [&_strong]:block [&_strong]:[font-size:13px] [&_strong]:[font-weight:550]
    [&_small]:block [&_small]:[color:#a09aa9] [&_small]:[font-size:11px] [&_small]:[margin-top:3px]
    [&_>_svg]:[margin-left:auto] [&_>_svg]:[color:#94909b]
  `,
  "user-avatar": String.raw`
    [width:38px] [height:38px] [border-radius:50%] [background:linear-gradient(135deg,_#eee3d5,_#dccfc2)] [color:#685a4d] grid [place-items:center] [font-size:12px] shrink-0
  `,
  "product-main": String.raw`
    [min-width:0] [flex:1] flex flex-col [height:100%] [min-height:0] overflow-hidden
  `,
  "product-topbar": String.raw`
    [height:83px] flex items-center justify-between [border-bottom:1px_solid_#efedf3] [padding:0_28px] [gap:16px] shrink-0 [min-height:83px]
    max-[780px]:[height:65px] max-[780px]:[padding:0_18px] max-[780px]:[min-height:65px]
    max-[780px]:[&_.breadcrumb-label]:[font-size:12px]
  `,
  "breadcrumb-label": String.raw`
    [font-size:13px] [color:#4f4958]
    max-[780px]:[margin-right:auto]
  `,
  "topbar-actions": String.raw`
    flex items-center [gap:14px]
  `,
  "workspace-search": String.raw`
    [width:292px] [height:42px] [border:1px_solid_#eeebf2] [border-radius:11px] flex items-center [gap:10px] [padding:0_13px] [background:#fff] [color:#a5a0ad] [font-size:12px] [box-shadow:0_2px_3px_#20202702]
    [&_kbd]:[margin-left:auto] [&_kbd]:[font-size:10px] [&_kbd]:[border:1px_solid_#f0edf4] [&_kbd]:[padding:2px_4px] [&_kbd]:[border-radius:4px]
    max-[1100px]:[width:230px]
    max-[780px]:[width:38px] max-[780px]:[padding:0] max-[780px]:justify-center max-[780px]:[background:transparent] max-[780px]:[border:0]
    max-[780px]:[&_span]:hidden
    max-[780px]:[&_kbd]:hidden
  `,
  "topbar-quick": String.raw`
    flex items-center [gap:8px] [background:linear-gradient(110deg,_#f0eafa,_#e6eff7)] [height:42px] [border:1px_solid_#e7e1ef] [border-radius:10px] [padding:0_15px] [font-size:12px] [color:#5d4e76]
    max-[1100px]:hidden
  `,
  "product-content": String.raw`
    [padding:27px_28px_22px] [flex:1] [min-width:0] [min-height:0] overflow-y-auto overflow-x-hidden [overscroll-behavior:contain] [max-height:calc(100dvh_-_83px)]
    min-[1500px]:[padding:30px]
    max-[1100px]:[padding:23px_20px]
    max-[780px]:[padding:22px_16px] max-[780px]:[max-height:calc(100dvh_-_65px)]
    [&_[data-slot="card"]]:[border-radius:21px] [&_[data-slot="card"]]:[border-color:#eae6ee] [&_[data-slot="card"]]:[background-color:white] [&_[data-slot="card"]]:[box-shadow:0_3px_9px_#30233504]
    [&_[data-slot="card"]_h3]:[font-size:17px] [&_[data-slot="card"]_h3]:[font-weight:550] [&_[data-slot="card"]_h3]:[color:#4a3f53] [&_[data-slot="card"]_h3]:[letter-spacing:-.35px]
    [&_textarea]:[border-radius:10px] [&_textarea]:[border-color:#e5e0ea]
    [&_[role="combobox"]]:[border-radius:9px] [&_[role="combobox"]]:[border-color:#e5e0ea] [&_[role="combobox"]]:[background-color:#fff] [&_[role="combobox"]]:[font-size:12px]
    [&_[data-slot="tabs-list"]]:[height:auto] [&_[data-slot="tabs-list"]]:[padding:4px] [&_[data-slot="tabs-list"]]:[border:1px_solid_#eee9f2] [&_[data-slot="tabs-list"]]:[border-radius:11px] [&_[data-slot="tabs-list"]]:[gap:3px] [&_[data-slot="tabs-list"]]:[background:#f1eef5] [&_[data-slot="tabs-list"]]:[width:fit-content] [&_[data-slot="tabs-list"]]:[max-width:100%] [&_[data-slot="tabs-list"]]:justify-start [&_[data-slot="tabs-list"]]:overflow-x-auto [&_[data-slot="tabs-list"]]:[margin-bottom:18px]
    [&_[data-slot="tabs-trigger"]]:[height:33px] [&_[data-slot="tabs-trigger"]]:[padding:6px_13px] [&_[data-slot="tabs-trigger"]]:[border:0] [&_[data-slot="tabs-trigger"]]:[border-radius:8px] [&_[data-slot="tabs-trigger"]]:[font-size:12px] [&_[data-slot="tabs-trigger"]]:[font-weight:450] [&_[data-slot="tabs-trigger"]]:[color:#918399]
    [&_[data-slot="tabs-trigger"]::after]:hidden
    [&_[data-slot="tabs-trigger"][data-state="active"]]:[color:#55455f] [&_[data-slot="tabs-trigger"][data-state="active"]]:[background:white] [&_[data-slot="tabs-trigger"][data-state="active"]]:[box-shadow:0_1px_4px_#3823410a]
    [&_>_.workspace-page_>_.workspace-page-body_>_.grid_>_[class*="border-muted"]]:[background:white] [&_>_.workspace-page_>_.workspace-page-body_>_.grid_>_[class*="border-muted"]]:[border-color:#eae6ee] [&_>_.workspace-page_>_.workspace-page-body_>_.grid_>_[class*="border-muted"]]:[border-radius:20px]
    [&_>_div_>_[role="tabpanel"]_>_[class*="border-muted"]]:[background:white] [&_>_div_>_[role="tabpanel"]_>_[class*="border-muted"]]:[border-color:#eae6ee] [&_>_div_>_[role="tabpanel"]_>_[class*="border-muted"]]:[border-radius:20px]
    [&_[role="tabpanel"]_>_.grid_>_[class*="border-muted"]]:[background:white] [&_[role="tabpanel"]_>_.grid_>_[class*="border-muted"]]:[border-color:#eae6ee] [&_[role="tabpanel"]_>_.grid_>_[class*="border-muted"]]:[border-radius:20px]
    [&_>_[class*="px-"]]:[padding:0]
    [&_>_[class*="p-6"]]:[padding:0]
    [&_>_[class*="p-4"]]:[padding:0]
    [&_>_div_>_.px-8]:[padding-left:0] [&_>_div_>_.px-8]:[padding-right:0]
    [&_.recharts-cartesian-axis-tick-value]:[font-family:var(--font-geist-sans),Arial,sans-serif] [&_.recharts-cartesian-axis-tick-value]:[fill:#9e8ca9] [&_.recharts-cartesian-axis-tick-value]:[font-size:11px]
    [&_.recharts-cartesian-grid_line]:[stroke:#f0eaf5]
    max-[780px]:[&_[data-slot="tabs-list"]]:[width:100%]
    max-[780px]:[&_[role="tabpanel"]_>_.grid_>_[class*="col-span-"]]:[grid-column:1_/_-1]
  `,
  "product-heading": String.raw`
    flex items-center justify-between [gap:18px] [margin-bottom:26px]
    [&_h1]:[font-size:28px] [&_h1]:[line-height:1.3] [&_h1]:[font-weight:550] [&_h1]:[letter-spacing:-1px] [&_h1]:[color:#24212a]
    [&_p]:[font-size:14px] [&_p]:[color:#817687] [&_p]:[margin-top:5px]
    min-[1500px]:[&_h1]:[font-size:30px]
    max-[1100px]:[&_h1]:[font-size:25px]
    max-[780px]:items-start max-[780px]:flex-wrap max-[780px]:[margin-bottom:20px]
    max-[780px]:[&_h1]:[font-size:26px]
    max-[780px]:[&_p]:[font-size:12px]
  `,
  "product-primary": String.raw`
    ![background:linear-gradient(_180deg,_#8e78ff_0%,_#6950ec_48%,_#7660f2_100%_)] ![box-shadow:inset_0_2px_3px_#fff7,_0_3px_7px_#7154dc18] ![color:white] ![border:1px_solid_#8a73f0] ![border-radius:10px] ![height:43px] ![padding:0_17px] ![font-weight:450]
    max-[780px]:![font-size:12px]
  `,
  "metrics-grid": String.raw`
    grid [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:16px] [margin-bottom:22px]
    max-[780px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[780px]:[gap:10px]
  `,
  "metric-card": String.raw`
    [background:#fff] [border:1px_solid_#ece9f0] [border-radius:21px] [padding:16px] [box-shadow:0_3px_7px_#24212a03]
    max-[1100px]:[padding:12px]
  `,
  "metric-label": String.raw`
    flex items-center [gap:9px] [color:#4b4354] [font-size:12px] whitespace-nowrap
    max-[1100px]:[font-size:10px] max-[1100px]:[gap:4px]
    max-[780px]:[font-size:12px] max-[780px]:[gap:7px]
  `,
  "metric-icon": String.raw`
    grid [place-items:center] [width:27px] [height:27px] [border-radius:8px] [box-shadow:0_2px_6px_#4e36550a]
    [&_svg]:[width:16px] [&_svg]:[height:16px] [&_svg]:[stroke-width:1.5]
  `,
  "metric-value": String.raw`
    flex items-center justify-between [gap:6px] [border-radius:13px] [background:#f7f6fa] [margin-top:12px] [padding:12px_14px] [min-height:59px]
    [&_strong]:[font-size:28px] [&_strong]:font-medium [&_strong]:[letter-spacing:-0.8px]
    [&_>_span]:[background:#eaf4ee] [&_>_span]:[color:#39905c] [&_>_span]:[border-radius:20px] [&_>_span]:[padding:5px_8px] [&_>_span]:[font-size:10px]
    max-[1100px]:[padding:10px]
    max-[1100px]:[&_strong]:[font-size:24px]
  `,
  "product-panel": String.raw`
    [background:#ffffffc4] [border:1px_solid_#ebe8f0] [border-radius:23px] [padding:22px] [box-shadow:0_4px_12px_#2e223904]
    max-[780px]:[padding:16px] max-[780px]:[border-radius:18px]
  `,
  "panel-toolbar": String.raw`
    flex items-center justify-between [gap:12px] [margin-bottom:22px]
    [&_h2]:[font-size:19px] [&_h2]:[font-weight:550] [&_h2]:[letter-spacing:-0.4px]
    [&_p]:[color:#a39cab] [&_p]:[font-size:12px] [&_p]:[margin-top:3px]
    max-[780px]:flex-wrap
  `,
  "filter-tabs": String.raw`
    flex [background:#f6f5f9] [border-radius:9px] [padding:3px] [gap:2px]
    [&_button]:[padding:6px_11px] [&_button]:[border-radius:7px] [&_button]:[font-size:12px] [&_button]:[color:#8c8596] [&_button]:whitespace-nowrap
    [&_button[aria-selected="true"]]:[background:white] [&_button[aria-selected="true"]]:[box-shadow:0_1px_4px_#28213209] [&_button[aria-selected="true"]]:[color:#39303f]
  `,
  "forms-grid": String.raw`
    grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:16px]
    max-[780px]:[grid-template-columns:1fr]
  `,
  "form-card": String.raw`
    [padding:21px] [border:1px_solid_#eae7ef] [border-radius:23px] [background:#fefeff] [box-shadow:0_3px_8px_#22202b03] [transition:border-color_0.15s,_box-shadow_0.15s]
    [&:hover]:[border-color:#d8d0e8] [&:hover]:[box-shadow:0_5px_18px_#61547309]
    [&_h3]:[font-size:18px] [&_h3]:[font-weight:550] [&_h3]:[letter-spacing:-0.3px] [&_h3]:[margin-bottom:6px]
    min-[1500px]:[padding:25px]
    max-[1100px]:[padding:17px]
  `,
  "form-card-top": String.raw`
    flex items-center justify-between [margin-bottom:20px] [gap:8px]
  `,
  "form-symbol": String.raw`
    grid [place-items:center] [width:36px] [height:36px] [background:#f8f6ff] [border:1px_solid_#f1edfa] [border-radius:10px] [color:#8367e9] [box-shadow:0_2px_4px_#4b2b6b07]
    [&_svg]:[width:21px] [&_svg]:[height:21px] [&_svg]:[stroke-width:1.5]
  `,
  "card-actions": String.raw`
    flex [gap:8px] items-center
    max-[1100px]:[gap:4px]
  `,
  "icon-button": String.raw`
    inline-flex items-center justify-center [background:#fff] [border:1px_solid_#eeebf2] [border-radius:7px] [width:27px] [height:27px] [color:#655d70] [box-shadow:0_1px_3px_#24212a03]
    [&_svg]:[width:15px] [&_svg]:[height:15px] [&_svg]:[stroke-width:1.65]
    [&:hover]:[color:#6a50df] [&:hover]:[background:#f5f1ff] [&:hover]:[border-color:#dcd3f6]
  `,
  "form-description": String.raw`
    [font-size:12px] [color:#817687] [min-height:32px] [line-height:1.6]
    min-[1500px]:[min-height:24px]
  `,
  "form-stats": String.raw`
    grid [grid-template-columns:1fr_1fr] [gap:14px] [margin-top:17px]
    [&_>_div]:[background:#f7f6fa] [&_>_div]:[padding:13px_16px] [&_>_div]:[border-radius:13px]
    [&_span]:block [&_span]:[font-size:12px] [&_span]:[color:#67606f] [&_span]:[margin-bottom:5px]
    [&_strong]:[font-size:24px] [&_strong]:font-medium [&_strong]:[letter-spacing:-0.7px]
    min-[1500px]:[margin-top:23px]
    min-[1500px]:[&_>_div]:[padding:17px]
  `,
  "status-pill": String.raw`
    inline-flex items-center [gap:5px] [font-size:11px] [padding:4px_8px] whitespace-nowrap [border-radius:5px] [background:#f3f1f6] [color:#928b9c]
    [&_i]:[height:5px] [&_i]:[width:5px] [&_i]:[border-radius:50%] [&_i]:[background:currentColor]
  `,
  "status-published": String.raw`
    [background:#edf7f0] [color:#379966]
  `,
  "status-active": String.raw`
    [background:#edf7f0] [color:#379966]
  `,
  "status-completed": String.raw`
    [background:#edf7f0] [color:#379966]
  `,
  "status-draft": String.raw`
    [background:#fdf1f1] [color:#cc686c]
  `,
  "status-archived": String.raw`
    [background:#fdf1f1] [color:#cc686c]
  `,
  "status-paused": String.raw`
    [background:#fdf1f1] [color:#cc686c]
  `,
  "status-scheduled": String.raw`
    [background:#f0ecff] [color:#795dd2]
  `,
  "product-empty": String.raw`
    [padding:65px_20px] flex items-center flex-col text-center [gap:13px] [color:#9a91a4]
    [&_h3]:[font-size:19px] [&_h3]:[color:#554b61] [&_h3]:font-medium
    [&_p]:[max-width:380px] [&_p]:[font-size:13px] [&_p]:[line-height:1.7]
  `,
  "empty-icon": String.raw`
    [background:#f4f0fc] [padding:17px] [border-radius:18px] [color:#9a88c7] [margin-bottom:4px]
  `,
  "product-modal": String.raw`
    [background:white] [border-radius:20px] [max-height:90svh] overflow-y-auto [font-family:var(--font-geist-sans),_Arial,_sans-serif] [box-shadow:0_24px_100px_#1a102735] [padding:26px]
    [&_h2]:[letter-spacing:-0.5px] [&_h2]:[font-size:22px] [&_h2]:[font-weight:550]
    max-[780px]:[padding:22px] max-[780px]:![max-width:calc(100vw_-_24px)]
  `,
  "product-field": String.raw`
    flex flex-col [gap:7px] [font-size:12px] [color:#706579]
    [&_>_span]:[font-weight:550]
    [&_small]:font-normal [&_small]:[color:#a297ac] [&_small]:[font-size:11px] [&_small]:[line-height:1.5]
    [&_input]:[width:100%] [&_input]:[border:1px_solid_#e5e0ea] [&_input]:[border-radius:9px] [&_input]:[min-height:41px] [&_input]:[padding:9px_12px] [&_input]:[background:#fff] [&_input]:[color:#403447] [&_input]:[outline:none] [&_input]:[font-size:13px]
    [&_select]:[width:100%] [&_select]:[border:1px_solid_#e5e0ea] [&_select]:[border-radius:9px] [&_select]:[min-height:41px] [&_select]:[padding:9px_12px] [&_select]:[background:#fff] [&_select]:[color:#403447] [&_select]:[outline:none] [&_select]:[font-size:13px]
    [&_textarea]:[width:100%] [&_textarea]:[border:1px_solid_#e5e0ea] [&_textarea]:[border-radius:9px] [&_textarea]:[min-height:41px] [&_textarea]:[padding:9px_12px] [&_textarea]:[background:#fff] [&_textarea]:[color:#403447] [&_textarea]:[outline:none] [&_textarea]:[font-size:13px] [&_textarea]:resize-y
    [&_input:focus]:[border-color:#aa91e6] [&_input:focus]:[box-shadow:0_0_0_3px_#9676dd0b]
    [&_select:focus]:[border-color:#aa91e6] [&_select:focus]:[box-shadow:0_0_0_3px_#9676dd0b]
    [&_textarea:focus]:[border-color:#aa91e6] [&_textarea:focus]:[box-shadow:0_0_0_3px_#9676dd0b]
  `,
  "product-input": String.raw`
    [width:100%] [border:1px_solid_#e5e0ea] [border-radius:9px] [min-height:41px] [padding:9px_12px] [background:#fff] [color:#403447] [outline:none] [font-size:13px]
    [&:focus]:[border-color:#aa91e6] [&:focus]:[box-shadow:0_0_0_3px_#9676dd0b]
  `,
  "product-form": String.raw`
    flex flex-col [gap:18px]
  `,
  "form-row": String.raw`
    grid [grid-template-columns:1fr_1fr] [gap:15px]
    max-[780px]:[grid-template-columns:1fr]
  `,
  "modal-actions": String.raw`
    flex justify-end [gap:10px] [padding-top:16px] [border-top:1px_solid_#f0ebf5]
  `,
  "product-error": String.raw`
    [color:#b04353] [background:#fff1f3] [border:1px_solid_#f4d8dc] [border-radius:8px] [padding:11px_13px] [font-size:12px]
  `,
  "editor-columns": String.raw`
    grid [grid-template-columns:1fr_1fr] [gap:28px]
    max-[780px]:[grid-template-columns:1fr]
  `,
  "editor-preview": String.raw`
    [background:#f7f5fa] [border:1px_solid_#ede8f3] [border-radius:14px] overflow-hidden [min-height:430px]
    max-[780px]:[min-height:300px]
  `,
  "editor-preview-label": String.raw`
    [padding:12px_18px] [font-size:10px] uppercase [letter-spacing:1.5px] [color:#a598b3] [border-bottom:1px_solid_#eee8f4]
  `,
  "email-preview": String.raw`
    [width:100%] [height:480px] [border:0] [background:#fff]
  `,
  "lead-form-preview": String.raw`
    [padding:28px]
    [&_h2]:[font-size:24px] [&_h2]:[line-height:1.25] [&_h2]:[color:#3f344b] [&_h2]:[letter-spacing:-0.7px] [&_h2]:[margin-bottom:10px]
    [&_p]:[font-size:13px] [&_p]:[line-height:1.7] [&_p]:[color:#9788a6] [&_p]:[margin-bottom:24px]
  `,
  "form-field-row": String.raw`
    grid [grid-template-columns:1fr_1fr_auto] items-center [gap:8px] [margin-top:8px]
    [&_input]:[min-width:0]
  `,
  "consent-row": String.raw`
    flex items-start [gap:8px] [font-size:11px] [line-height:1.65] [color:#91829f]
    [&_input]:[margin-top:4px] [&_input]:[accent-color:#7254e3]
  `,
  "product-footer": String.raw`
    flex justify-between [padding:13px_30px_17px] [font-size:10px] [color:#bbb2c3] [gap:12px]
    [&_>_span:last-child]:flex [&_>_span:last-child]:[gap:5px] [&_>_span:last-child]:items-center
    max-[780px]:[padding:18px] max-[780px]:[font-size:9px]
    max-[780px]:[&_>_span:last-child]:hidden
  `,
  "search-results": String.raw`
    flex flex-col [gap:4px]
    [&_button]:flex [&_button]:items-center [&_button]:[gap:12px] [&_button]:[padding:13px] [&_button]:[border-radius:9px] [&_button]:text-left
    [&_button:hover]:[background:#f7f3fd]
    [&_button_>_svg:last-child]:[margin-left:auto]
  `,
  "mobile-menu": String.raw`
    hidden
    max-[780px]:inline-flex
  `,
  "eyebrow": String.raw`
    [color:#9b89b3] [font-size:10px] [letter-spacing:1.5px] uppercase block [margin-bottom:10px]
  `,
  "table-wrap": String.raw`
    overflow-auto
  `,
  "product-table": String.raw`
    [width:100%] border-collapse text-left [font-size:12px]
    [&_th]:[color:#a59aad] [&_th]:[font-weight:450] [&_th]:[padding:13px_16px] [&_th]:[background:#faf8fc] [&_th]:[font-size:11px]
    [&_td]:[padding:18px_16px] [&_td]:[border-bottom:1px_solid_#f0ecf4] [&_td]:[color:#6f627c]
    [&_tr:last-child_td]:[border-bottom:0]
    [&_td_strong]:[color:#403548] [&_td_strong]:[font-weight:550] [&_td_strong]:block [&_td_strong]:[font-size:13px]
    [&_td_small]:block [&_td_small]:[margin-top:5px] [&_td_small]:[color:#a89caf] [&_td_small]:[font-size:11px]
    [&_tbody_tr:hover]:[background:#fdfbff]
    max-[780px]:[&_td]:[padding:13px_10px]
    max-[780px]:[&_th]:[padding:13px_10px]
  `,
  "template-grid": String.raw`
    grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:18px]
    max-[1100px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]
    max-[780px]:[grid-template-columns:1fr_1fr]
  `,
  "template-card": String.raw`
    [border:1px_solid_#e9e2f0] [border-radius:17px] overflow-hidden [background:#fff]
  `,
  "template-art": String.raw`
    [height:220px] [background:#f1edf7] [padding:22px_33px_0] overflow-hidden relative
    max-[780px]:[padding:15px_15px_0] max-[780px]:[height:180px]
  `,
  "mini-email": String.raw`
    [height:245px] [background:#fff] [box-shadow:0_4px_20px_#34234310] [border-radius:6px] [padding:22px] text-left
    [&_small]:[font-size:7px] [&_small]:[letter-spacing:2px]
    [&_h3]:[font-size:22px] [&_h3]:[line-height:1.15] [&_h3]:[letter-spacing:-0.7px] [&_h3]:[margin:17px_0_15px] [&_h3]:font-semibold
    [&_.line]:[height:4px] [&_.line]:[margin:7px_0] [&_.line]:[background:#eeebf3] [&_.line]:[border-radius:3px]
    [&_.color-block]:[height:48px] [&_.color-block]:[margin-top:17px] [&_.color-block]:[border-radius:5px] [&_.color-block]:[opacity:0.14]
    max-[780px]:[padding:15px]
    max-[780px]:[&_h3]:[font-size:18px]
  `,
  "template-info": String.raw`
    [padding:18px]
    [&_h3]:[font-size:15px] [&_h3]:[font-weight:550] [&_h3]:[color:#554460]
    [&_p]:[font-size:12px] [&_p]:[line-height:1.6] [&_p]:[color:#817687] [&_p]:[margin:6px_0_16px]
  `,
  "newsletter-title": String.raw`
    flex [gap:11px] items-center
    [&_>_span]:[width:36px] [&_>_span]:[height:40px] [&_>_span]:[background:#f3eefc] [&_>_span]:[border-radius:9px] [&_>_span]:grid [&_>_span]:[place-items:center] [&_>_span]:[color:#9d82ca]
  `,
  "sidebar-collapsed": String.raw`
    [&_.product-sidebar]:[width:84px] [&_.product-sidebar]:[padding:28px_14px]
    [&_.collapse-sidebar]:hidden
    [&_.brand]:[margin-left:8px]
    [&_.product-nav-item]:justify-center [&_.product-nav-item]:[padding:0]
  `,
  "mobile-sidebar": String.raw`
    flex flex-col [background:#fdfcfe] ![width:260px] [padding:30px_20px]
    max-[780px]:overflow-y-auto
  `,
  "public-form-page": String.raw`
    [min-height:100svh] [background:#f5f2fa] flex items-center justify-center [padding:24px]
  `,
  "public-form-card": String.raw`
    [max-width:480px] [width:100%] [padding:40px] [background:white] [border:1px_solid_#e7dfef] [border-radius:22px] [box-shadow:0_20px_70px_#38234908]
    [&_h1]:[font-size:28px] [&_h1]:[letter-spacing:-1px] [&_h1]:[font-weight:550]
    [&_>_p]:[color:#8f809c] [&_>_p]:[font-size:14px] [&_>_p]:[line-height:1.7] [&_>_p]:[margin:12px_0_24px]
  `,
  "crm-stage": String.raw`
    [font-size:9px] [letter-spacing:0.5px] [padding:5px_8px] [border-radius:5px] [background:#f3eefb] [color:#9581b4]
  `,
  "stage-qualified": String.raw`
    [background:#fff6e7] [color:#ba984b]
  `,
  "stage-customer": String.raw`
    [background:#edf7f0] [color:#52966b]
  `,
  "stage-lost": String.raw`
    [background:#f8eeee] [color:#b57b7b]
  `,
  "crm-pipeline": String.raw`
    grid [grid-template-columns:repeat(4,_minmax(180px,_1fr))] [gap:13px] overflow-auto
  `,
  "pipeline-column": String.raw`
    [border-radius:12px] [background:#f7f4fa] [padding:12px] [min-height:330px]
    [&_h3]:flex [&_h3]:items-center [&_h3]:[gap:7px] [&_h3]:[font-size:12px] [&_h3]:[color:#7d688f] [&_h3]:[margin:3px_0_17px]
    [&_h3_small]:[margin-left:auto] [&_h3_small]:[background:#ebe4f2] [&_h3_small]:[padding:2px_6px] [&_h3_small]:[border-radius:4px]
  `,
  "stage-dot": String.raw`
    [height:6px] [width:6px] [border-radius:50%] [background:#a996c9]
  `,
  "pipeline-contact": String.raw`
    block text-left [width:100%] [padding:15px] [background:white] [border:1px_solid_#ece4f3] [border-radius:10px] [margin:8px_0] [box-shadow:0_2px_4px_#38234304]
    [&_strong]:block [&_strong]:[font-size:12px] [&_strong]:[font-weight:550]
    [&_>_span]:[font-size:11px] [&_>_span]:[color:#ad9bbb] [&_>_span]:block [&_>_span]:[margin:6px_0]
    [&_small]:flex [&_small]:items-center [&_small]:[gap:5px] [&_small]:[font-size:9px] [&_small]:[color:#b3a2c0] [&_small]:[margin-top:17px]
  `,
  "contact-note": String.raw`
    [background:#f9f6fc] [border-radius:10px] [padding:13px_15px] [margin-top:12px]
    [&_p]:whitespace-pre-wrap [&_p]:[font-size:12px] [&_p]:[line-height:1.7] [&_p]:[color:#7c658d]
    [&_small]:[font-size:10px] [&_small]:[color:#b29bbf] [&_small]:block [&_small]:[margin-top:8px]
  `,
  "automation-starters": String.raw`
    grid [grid-template-columns:1fr_1fr] [gap:18px] [margin-bottom:24px]
    [&_>_button]:flex [&_>_button]:items-center [&_>_button]:[gap:16px] [&_>_button]:[padding:24px] [&_>_button]:[background:linear-gradient(110deg,_#f9f5ff,_#fff)] [&_>_button]:[border:1px_solid_#e9e1f2] [&_>_button]:[border-radius:17px] [&_>_button]:text-left
    [&_strong]:[font-size:14px] [&_strong]:[font-weight:550] [&_strong]:[letter-spacing:-0.2px] [&_strong]:[color:#6d557e]
    [&_p]:[font-size:12px] [&_p]:[color:#b29cbf] [&_p]:[margin-top:5px]
    [&_>_button_>_svg]:[margin-left:auto] [&_>_button_>_svg]:[width:18px] [&_>_button_>_svg]:[color:#c0adcb]
    max-[900px]:[grid-template-columns:1fr]
    max-[600px]:[&_>_button]:[padding:18px]
  `,
  "starter-icon": String.raw`
    grid [place-items:center] shrink-0 [width:46px] [height:46px] [border-radius:13px] [background:#eee5fd] [color:#a083cc]
    [&.peach]:[background:#fbebdf] [&.peach]:[color:#c39a7e]
  `,
  "automation-editor": String.raw`
    [margin:-27px_-28px_-22px] [min-height:calc(100svh_-_177px)] flex flex-col
    max-[900px]:[margin:-23px_-20px_-22px]
    max-[600px]:[margin:-22px_-16px]
  `,
  "builder-toolbar": String.raw`
    flex items-center [gap:11px] [padding:17px_20px] [border-bottom:1px_solid_#e9e0f1] [background:#fff]
    [&_>_input]:[max-width:210px] [&_>_input]:[min-width:100px] [&_>_input]:[flex:1] [&_>_input]:[background:transparent] [&_>_input]:[border:0] [&_>_input]:[outline:none] [&_>_input]:[color:#5d426e] [&_>_input]:[font-size:14px] [&_>_input]:[font-weight:550]
    max-[1200px]:flex-wrap
    max-[600px]:[padding:13px]
  `,
  "builder-toolbar-actions": String.raw`
    flex [gap:8px] [margin-left:auto]
    max-[1200px]:[gap:5px]
    max-[1200px]:[&_button]:[font-size:10px] max-[1200px]:[&_button]:[padding:7px_10px]
    max-[600px]:[width:100%] max-[600px]:justify-end max-[600px]:flex-wrap
  `,
  "save-state": String.raw`
    [font-size:10px] [color:#b59fc3]
    max-[1200px]:hidden
  `,
  "builder-workspace": String.raw`
    flex [min-height:520px] [flex:1] [height:calc(100svh_-_240px)]
    max-[600px]:flex-wrap max-[600px]:[min-height:0] max-[600px]:[height:auto]
  `,
  "step-palette": String.raw`
    [padding:25px_17px] [width:225px] [background:#fefcff] [border-right:1px_solid_#e9e0f0] shrink-0
    [&_h3]:[font-size:17px] [&_h3]:[letter-spacing:-0.5px] [&_h3]:[color:#644976] [&_h3]:font-medium
    [&_>_p]:[font-size:11px] [&_>_p]:[line-height:1.7] [&_>_p]:[color:#817687] [&_>_p]:[margin:8px_0_23px]
    [&_>_button]:flex [&_>_button]:[width:100%] [&_>_button]:items-center [&_>_button]:text-left [&_>_button]:[gap:9px] [&_>_button]:[padding:11px_0] [&_>_button]:[border-bottom:1px_solid_#f0e8f6]
    [&_>_button_strong]:[font-size:12px] [&_>_button_strong]:[font-weight:550] [&_>_button_strong]:block [&_>_button_strong]:[color:#695575]
    [&_>_button_small]:block [&_>_button_small]:[font-size:10px] [&_>_button_small]:[margin-top:4px] [&_>_button_small]:[color:#96839e]
    [&_>_button_>_svg]:[margin-left:auto] [&_>_button_>_svg]:[color:#b7a0c9]
    max-[1200px]:[width:190px] max-[1200px]:[padding:20px_13px]
    max-[900px]:[width:65px] max-[900px]:[padding:18px_12px]
    max-[900px]:[&_.eyebrow]:hidden
    max-[900px]:[&_h3]:hidden
    max-[900px]:[&_>_p]:hidden
    max-[900px]:[&_button_>_span:nth-child(2)]:hidden
    max-[900px]:[&_button_>_svg]:hidden
    max-[600px]:[width:55px]
  `,
  "step-icon": String.raw`
    [width:36px] [height:36px] grid [place-items:center] shrink-0 [border-radius:9px] [background:#f0e5fe] [color:#9c70cc]
  `,
  "step-start": String.raw`
    [color:#b68b51] [background:#fbefdb]
  `,
  "step-email": String.raw`
    [color:#9a79cd] [background:#f1e9fe]
  `,
  "step-wait": String.raw`
    [color:#75a7ba] [background:#eaf6fa]
  `,
  "step-condition": String.raw`
    [color:#cb9476] [background:#f9ede4]
  `,
  "step-exit": String.raw`
    [color:#8ba494] [background:#edf5ef]
  `,
  "palette-hint": String.raw`
    flex items-start [gap:9px] [margin-top:35px] [color:#9986a4] [padding:13px] [border:1px_dashed_#e4d6ee] [border-radius:10px]
    [&_svg]:shrink-0
    [&_p]:[font-size:10px] [&_p]:[line-height:1.7]
    max-[900px]:hidden
  `,
  "workflow-canvas": String.raw`
    [&_.react-flow\_\_handle]:[background:#c6abd9] [&_.react-flow\_\_handle]:[border:2px_solid_#fff] [&_.react-flow\_\_handle]:[width:8px] [&_.react-flow\_\_handle]:[height:8px] [&_.react-flow\_\_controls]:![box-shadow:0_2px_7px_#38234a0c] [&_.react-flow\_\_controls]:[border:1px_solid_#e6dbef] [&_.react-flow\_\_controls]:[border-radius:7px] [&_.react-flow\_\_controls]:overflow-hidden [&_.react-flow\_\_controls-button]:![border-bottom:1px_solid_#efe6f7] [&_.react-flow\_\_controls-button]:![background:#fff] [&_.react-flow\_\_controls-button]:![fill:#ab90bd]
    [min-width:0] [flex:1] [background:#f8f5fc] relative [min-height:520px]
    max-[600px]:[min-height:440px] max-[600px]:[flex:1] max-[600px]:[height:440px]
  `,
  "canvas-label": String.raw`
    absolute [top:20px] [left:20px] [z-index:1] [color:#bea9cd] flex items-center [gap:7px] [font-size:8px] [letter-spacing:1.4px]
  `,
  "workflow-step": String.raw`
    flex items-center [gap:14px] [width:300px] [min-height:88px] [background:white] [border:1px_solid_#e3d7ed] [border-radius:13px] [padding:17px] [box-shadow:0_4px_12px_#3f23590a] relative
    [&.selected]:[border-color:#a87bd7] [&.selected]:[box-shadow:0_0_0_3px_#b898e117,_0_7px_20px_#5232760b]
    [&_small]:[font-size:9px] [&_small]:[letter-spacing:1px] [&_small]:[color:#96839f]
    [&_strong]:block [&_strong]:[font-size:14px] [&_strong]:[font-weight:550] [&_strong]:[color:#5c4869] [&_strong]:[margin-top:4px]
    [&_p]:[font-size:11px] [&_p]:[color:#93819f] [&_p]:[margin-top:4px] [&_p]:[max-width:195px] [&_p]:whitespace-nowrap [&_p]:overflow-hidden [&_p]:text-ellipsis
    max-[1200px]:[width:275px]
  `,
  "step-chevron": String.raw`
    [color:#cbb6d9] [margin-left:auto]
  `,
  "react-flow__handle": String.raw`
    [background:#c6abd9] [border:2px_solid_#fff] [width:8px] [height:8px]
  `,
  "step-inspector": String.raw`
    [width:270px] shrink-0 [padding:24px_20px] [background:#fff] [border-left:1px_solid_#e9e0f0] flex flex-col overflow-auto
    max-[1200px]:[width:240px] max-[1200px]:[padding:20px_15px]
    max-[900px]:[width:220px]
    max-[600px]:[width:100%] max-[600px]:[border-left:0] max-[600px]:[border-top:1px_solid_#e8ddf0] max-[600px]:[min-height:200px]
  `,
  "inspector-title": String.raw`
    flex [gap:12px] items-center [padding-bottom:25px] [margin-bottom:20px] [border-bottom:1px_solid_#f2e9f8]
    [&_small]:[font-size:8px] [&_small]:[letter-spacing:1.1px] [&_small]:[color:#c1a5d2]
    [&_h3]:[font-size:14px] [&_h3]:[color:#79608a] [&_h3]:[font-weight:550] [&_h3]:[margin-top:5px]
  `,
  "inspector-help": String.raw`
    [font-size:11px] [color:#817687] [line-height:1.9]
  `,
  "inspector-footer": String.raw`
    [margin-top:auto] [border-top:1px_solid_#f0e6f7] [padding-top:20px] flex [gap:8px] items-start [color:#9986a4] [font-size:10px] [line-height:1.7]
    [&_svg]:shrink-0
    max-[600px]:[margin-top:20px]
  `,
  "builder-error": String.raw`
    [border-radius:0] [border-width:0_0_1px] [margin:0]
  `,
  "builder-notice": String.raw`
    [background:#f3eefb] [padding:10px_24px] [font-size:11px] [color:#a58bbc]
  `,
  "react-flow__controls": String.raw`
    ![box-shadow:0_2px_7px_#38234a0c] [border:1px_solid_#e6dbef] [border-radius:7px] overflow-hidden
  `,
  "react-flow__controls-button": String.raw`
    ![border-bottom:1px_solid_#efe6f7] ![background:#fff] ![fill:#ab90bd]
  `,
  "mail-workspace": String.raw`
    flex [margin:-27px_-28px_-22px] [height:calc(100dvh_-_83px)] [min-height:0] [background:#fff] overflow-hidden
    max-[1100px]:[margin:-23px_-20px_-22px]
    max-[780px]:[margin:-22px_-16px] max-[780px]:[height:calc(100dvh_-_65px)]
  `,
  "mail-folders": String.raw`
    [width:180px] shrink-0 [background:#f9f9fa] [padding:22px_13px] [border-right:1px_solid_#ecebed] flex flex-col
    max-[1300px]:[width:150px] max-[1300px]:[padding:20px_10px]
    max-[1100px]:[width:130px]
    max-[780px]:[width:120px]
  `,
  "mail-workspace-title": String.raw`
    [padding:0_5px_20px]
    [&_strong]:block [&_strong]:[font-size:14px] [&_strong]:[font-weight:550] [&_strong]:[margin:12px_0_5px]
    [&_small]:[font-size:10px] [&_small]:[color:#a4a0a8]
    max-[1100px]:[&_small]:hidden
  `,
  "mail-account-mark": String.raw`
    [width:30px] [height:30px] [border-radius:50%] [background:#25282a] [color:white] grid [place-items:center]
  `,
  "compose-button": String.raw`
    ![background:linear-gradient(#278b87,_#197976)] ![color:white] ![border-radius:8px] ![border:1px_solid_#2a8b88] ![box-shadow:inset_0_1px_1px_#ffffff50] ![height:38px]
  `,
  "mail-folder-list": String.raw`
    [margin-top:18px] [border-top:1px_solid_#eae8ed] [padding-top:14px]
    [&_button]:flex [&_button]:items-center [&_button]:[gap:10px] [&_button]:[width:100%] [&_button]:[padding:12px_10px] [&_button]:[border-radius:8px] [&_button]:[font-size:12px] [&_button]:[color:#8e8991] [&_button]:[border:1px_solid_transparent]
    [&_button.active]:[background:white] [&_button.active]:[border-color:#eae8ed] [&_button.active]:[box-shadow:0_1px_3px_#25212d04] [&_button.active]:[color:#37323b] [&_button.active]:[font-weight:550]
    [&_small]:[margin-left:auto]
    max-[780px]:overflow-y-auto
  `,
  "mail-folder-note": String.raw`
    [font-size:10px] [line-height:1.9] [color:#aaa3af] [margin-top:auto] [padding:16px_5px]
    [&_a]:[color:#6c9693]
  `,
  "mail-list-pane": String.raw`
    [width:320px] shrink-0 [border-right:1px_solid_#eae9ed] flex flex-col [min-width:0]
    max-[1300px]:[width:285px]
    max-[1100px]:[width:240px]
    max-[780px]:[flex:1] max-[780px]:[width:auto]
  `,
  "mail-list-heading": String.raw`
    [padding:24px_20px_17px] flex items-center justify-between
    [&_h1]:flex [&_h1]:items-center [&_h1]:[gap:8px] [&_h1]:[font-size:18px] [&_h1]:[font-weight:550] [&_h1]:[letter-spacing:-0.4px]
    [&_p]:[font-size:11px] [&_p]:[color:#a09aa5] [&_p]:[margin-top:7px]
  `,
  "mail-search": String.raw`
    flex items-center [gap:10px] [border:1px_solid_#e9e6ed] [border-radius:9px] [margin:0_18px_17px] [padding:11px] [color:#a49cae]
    [&_input]:[outline:0] [&_input]:[width:100%] [&_input]:[font-size:12px] [&_input]:[min-width:0]
    [&_kbd]:[font-size:10px]
  `,
  "mail-list-scroll": String.raw`
    overflow-auto [flex:1] [padding:0_14px]
  `,
  "mail-group-label": String.raw`
    flex [gap:8px] items-center [color:#6ba19b] [font-size:10px] [padding:8px_6px_15px]
  `,
  "mail-list-item": String.raw`
    [width:100%] flex items-start [gap:10px] [padding:18px_7px] text-left [border-bottom:1px_solid_#eeebf2] [border-left:2px_solid_transparent] [border-radius:3px]
    [&.selected]:[background:#f0f7f5] [&.selected]:[border-left-color:#3d948c] [&.selected]:[padding-left:9px]
    [&_>_div]:[min-width:0] [&_>_div]:[flex:1]
    [&_p]:[font-size:10px] [&_p]:[margin-top:6px] [&_p]:whitespace-nowrap [&_p]:text-ellipsis [&_p]:overflow-hidden [&_p]:[color:#b6a6c0]
  `,
  "mail-avatar": String.raw`
    [height:31px] [width:31px] grid [place-items:center] [border-radius:50%] shrink-0 [background:#e6eeee] [color:#78928d] [font-size:12px]
  `,
  "mail-item-line": String.raw`
    flex items-center [gap:6px]
    [&_strong]:[font-size:12px] [&_strong]:[font-weight:550] [&_strong]:[color:#605569] [&_strong]:overflow-hidden [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap
    [&_time]:[margin-left:auto] [&_time]:whitespace-nowrap [&_time]:[font-size:9px] [&_time]:[color:#a99bb3]
  `,
  "mail-subject": String.raw`
    [font-size:11px] [color:#a08fab] [margin-top:7px] block overflow-hidden text-ellipsis whitespace-nowrap
  `,
  "mail-detail-pane": String.raw`
    [flex:1] [min-width:0] overflow-auto
    max-[780px]:hidden
  `,
  "mail-detail-toolbar": String.raw`
    [height:65px] flex items-center [gap:13px] [padding:0_22px] [border-bottom:1px_solid_#eeeaf2]
    [&_.icon-button]:[border:0] [&_.icon-button]:[box-shadow:none] [&_.icon-button]:[color:#a197a9]
    max-[1100px]:[gap:7px]
  `,
  "mail-subject-heading": String.raw`
    [padding:25px_25px_22px] [border-bottom:1px_solid_#eeeaf2]
    [&_p]:[font-size:11px] [&_p]:[color:#b4a4bd] [&_p]:[margin-bottom:11px]
    [&_h2]:[font-size:23px] [&_h2]:font-medium [&_h2]:[letter-spacing:-0.6px] [&_h2]:[color:#52405e] [&_h2]:[line-height:1.35]
    max-[1300px]:[padding:20px]
    max-[1300px]:[&_h2]:[font-size:20px]
  `,
  "mail-message": String.raw`
    [padding:25px]
    max-[1300px]:[padding:20px]
  `,
  "mail-sender": String.raw`
    flex items-center [gap:12px]
    [&_strong]:[font-size:14px] [&_strong]:font-medium [&_strong]:[color:#6d5579]
    [&_p]:[font-size:11px] [&_p]:[color:#ad99b8] [&_p]:[margin-top:5px]
    [&_time]:[margin-left:auto] [&_time]:[font-size:10px] [&_time]:[color:#b59fbd]
  `,
  "mail-recipients": String.raw`
    [font-size:10px] [color:#b6a2c1] [margin-top:18px] [line-height:2]
    [&_span]:[border:1px_solid_#eee5f4] [&_span]:[border-radius:6px] [&_span]:[padding:4px_7px] [&_span]:[color:#a58ab4]
  `,
  "remote-images-note": String.raw`
    [font-size:10px] [padding:13px] [background:#f6f9f8] [border:1px_solid_#edf2f0] [border-radius:8px] [color:#96aaa4] [margin:25px_0]
    [&_button]:underline [&_button]:[margin-left:8px] [&_button]:[color:#6d9790]
  `,
  "mail-body": String.raw`
    [width:100%] [border:0] [min-height:330px]
  `,
  "mail-attachments": String.raw`
    flex flex-wrap [gap:8px]
    [&_a]:flex [&_a]:items-center [&_a]:[gap:7px] [&_a]:[border:1px_solid_#ebe1f1] [&_a]:[border-radius:8px] [&_a]:[padding:8px_10px] [&_a]:[font-size:10px] [&_a]:[color:#a88ab9]
  `,
  "mail-empty": String.raw`
    [height:100%] flex items-center justify-center flex-col [gap:14px] [color:#c0b1ca] [background:#fdfcfe]
    [&_h2]:[font-size:20px] [&_h2]:[font-weight:450] [&_h2]:[letter-spacing:-0.4px] [&_h2]:[color:#a591b5]
    [&_p]:[font-size:12px]
  `,
  "mail-back": String.raw`
    !hidden
    max-[780px]:!inline-flex
  `,
  "mail-open": String.raw`
    max-[780px]:[&_.mail-folders]:hidden
    max-[780px]:[&_.mail-list-pane]:hidden
    max-[780px]:[&_.mail-detail-pane]:block
  `,
  "preview-banner": String.raw`
    [font-size:9px] text-center [letter-spacing:1.5px] [color:#9d8fa8] [background:#e9e7ec] [padding:6px] relative [z-index:5]
  `,
  "product-nav-settings": String.raw`
    [&_summary]:[list-style:none] [&_summary]:cursor-pointer
    [&_summary::-webkit-details-marker]:hidden
    [&[open]_summary]:[color:#6a50df]
    [&_>_a]:[font-size:12px] [&_>_a]:[padding-left:42px] [&_>_a]:[height:35px]
  `,
  "workspace-page": String.raw`
    [min-width:0]
  `,
  "workspace-page-body": String.raw`
    [min-width:0]
  `,
  "workspace-page-heading": String.raw`
    [margin-bottom:26px] [background:transparent]
    max-[780px]:[&_h1]:[font-size:24px]
  `,
  "workspace-heading-actions": String.raw`
    flex items-center flex-wrap [gap:10px]
    max-[780px]:[width:100%]
  `,
  "workspace-back-link": String.raw`
    inline-flex items-center [gap:4px] [color:#93849c] [font-size:11px] [margin-bottom:10px]
  `,
  "workspace-data-table": String.raw`
    [border-radius:20px] [background:#fff] [padding:8px] [border:1px_solid_#eae6ee]
    [&_>_div:first-child]:[border:0] [&_>_div:first-child]:[border-radius:14px]
    [&_>_div:last-child:not(:first-child)]:[padding:10px_12px]
    [&_>_div:last-child_p]:[font-size:11px]
    [&_>_div:last-child_>_div]:[font-size:11px]
    max-[780px]:[&_>_div:last-child]:flex-wrap max-[780px]:[&_>_div:last-child]:[gap:12px]
    max-[780px]:[&_>_div:last-child_>_div:last-child]:flex-wrap max-[780px]:[&_>_div:last-child_>_div:last-child]:[gap:12px] max-[780px]:[&_>_div:last-child_>_div:last-child]:[margin-left:0]
  `,
  "metric-period": String.raw`
    [margin:10px_3px_0] [font-size:10px] [color:#9e92a7]
  `,
  "template-editor-workspace": String.raw`
    [background:white] [border:1px_solid_#eae6ee] [border-radius:20px] overflow-hidden [min-height:600px]
  `,
  "workspace-dialog": String.raw`
    ![border-radius:20px] [border-color:#e8e0ee] [max-height:90svh] overflow-y-auto [box-shadow:0_25px_100px_#2b17322b]
    [&_h2]:[font-size:21px] [&_h2]:[font-weight:550] [&_h2]:[letter-spacing:-.5px] [&_h2]:[color:#4a3855]
  `,
  "auth-workspace": String.raw`
    [min-height:100svh] [padding:44px_20px] [background:#f5f3f8] flex flex-col items-center justify-center
  `,
  "auth-brand": String.raw`
    flex items-center [gap:10px] [color:#33283d] font-semibold [font-size:24px] [margin-bottom:30px]
  `,
  "auth-card": String.raw`
    [width:min(100%,520px)] [background:white] [border:1px_solid_#e9e2ef] [border-radius:24px] [padding:12px] [box-shadow:0_12px_45px_#3c254008]
    [&_>_div]:[width:100%]
    [&_h1]:[font-size:28px] [&_h1]:[color:#3c2b49] [&_h1]:[font-weight:550] [&_h1]:[letter-spacing:-.8px]
    [&_.text-white]:[color:#81728d]
    [&_.text-primary-foreground]:[color:#81728d]
    [&_input]:![color:#493950] [&_input]:![border:1px_solid_#e5dcec] [&_input]:[background:white]
    [&_[class*="w-[400px]"]]:[width:100%] [&_[class*="w-[400px]"]]:[max-width:400px]
    [&_[class*="w-[300px]"]]:[width:100%] [&_[class*="w-[300px]"]]:[max-width:400px]
    [&_form_button[type="submit"]]:block [&_form_button[type="submit"]]:[width:100%] [&_form_button[type="submit"]]:[min-height:42px] [&_form_button[type="submit"]]:[padding:10px_16px] [&_form_button[type="submit"]]:[border-radius:10px] [&_form_button[type="submit"]]:[background:linear-gradient(#8b73f5,#6e53e7)] [&_form_button[type="submit"]]:[border:1px_solid_#8e76ea] [&_form_button[type="submit"]]:[color:white] [&_form_button[type="submit"]]:[font-size:13px]
    [&_a]:[color:#7960bc]
    max-[780px]:[padding:0]
  `,
  "auth-footer": String.raw`
    [margin-top:28px] [font-size:11px] [color:#a799b1]
  `,
};

/** Expand a shared component recipe into static Tailwind utilities. */
export function workspaceClassName(value: string): string {
  return value.split(/\s+/).filter(Boolean).map(name => recipes[name] ? `${name} ${recipes[name]}` : name).join(" ");
}
