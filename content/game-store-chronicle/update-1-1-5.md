# Game Store Chronicle — Update 1.1.5

Update 1.1.5 is a major simulation, NPC, and performance release. It makes the city feel more alive, gives customers more believable reasons for visiting and buying, adds meaningful operating costs through the new Simulation Mode, and moves expensive loading and saving work away from active gameplay. The update also brings three save slots, Sandbox tools, deeper Store Reports, new boost cards, Spanish support, visual upgrades, and broad gamepad and Steam Deck improvements.

## Simulation Mode — A Deeper Store Economy

- Added **Simulation Mode** as a permanent choice when creating a save. Game type (Standard or Sandbox) and Simulation Mode can be selected independently.
- Simulation Mode introduces store rent, backroom leasing, electricity bills, and paid repairs. Players who prefer the previous lighter economy can disable Simulation Mode without disabling wages, product orders, furniture, decoration, or expansion purchases.
- Store rent begins at **$25 per day** and increases by **$15 for each purchased expansion**.
- The backroom is now a managed lease. Activating or reactivating it after closing costs **$200**, followed by **$5 daily rent plus $5 per expansion**. The lease can be canceled after closing once the room is empty.
- Artificial store lights and display booths now consume electricity while the business day advances. The bill combines a **$5 daily service charge** with metered usage and is paid at the end of the day.
- Electricity use, powered load, category breakdowns, discounts, and the current estimated bill are preserved through save/load and shown in Store Reports. Skip Day now includes the projected remaining electricity cost.
- Player repairs cost **$5 per completed condition step** in Simulation Mode. Employee repairs cost 10% more. Repairs still work for free when Simulation Mode is disabled.
- Beginning-of-day costs now resolve consistently before bankruptcy checks: store rent, backroom rent, mascot cost, and employee wages.
- The backroom expands together with the sales floor. New strips extend the floor, walls, windows, lights, navigation area, employee storage area, and customer restriction volume.
- Expansion confirmations now explain the resulting daily rent when Simulation Mode is active.
- Regular and video day-transition screens now hold a complete simulation pause until their final fade has finished, preventing time, NPCs, or player actions from advancing behind the presentation.

## NPCs and Customer Simulation — A Living City

- Replaced the legacy regular-customer system with a new persistent population built from **12 base character models** across male and female age groups.
- The store's **293 regular residents** now keep their identity and appearance within each save. Clothing colors, skin tones, hair color and style, dresses, jackets, shoes, patterns, graphics, caps, sunglasses, backpacks, and other supported features remain consistent when a person returns.
- Removed the old set of 40 regular-customer prefabs and obsolete source assets. The seven unique/special customers keep their authored appearances and behavior.
- Pedestrian life and shopping demand are now separate systems. Ambient residents keep both sidewalks active before opening, during business hours, and after closing, while shopper opportunities are added according to the live state of the store.
- Residents are no longer consumed after walking past or leaving the map. They can return as ordinary pedestrians throughout the day, while confirmed store visits prevent normal repeat shopping on the same day.
- New outdoor routes use dedicated sidewalk and crosswalk navigation, hidden corner entrances, independent arrival timing, lane separation, continuous turns, bounded route recovery, and finite journeys.
- Pedestrians can walk at personal speeds, give one another right of way, cross the road, and stop for short ambient conversations without blocking one another or the store simulation.
- Customers now make their store-entry decision at the storefront. Rating, stock, store capacity, time, personality, window displays, the greeter, active boosts, and current progression all contribute to the result.
- Window displays can convert passersby into shoppers. Greeter influence is now based on genuine nearby interactions instead of a global bonus.
- Inside the store, customers observe real shelves and product slots, consider products based on their traits and interests, reject products they already own, compare prices, and move through multiple shopping decisions instead of relying on a single generic target.
- Products discounted by more than 10% below market price now attract additional attention. Deeper discounts provide a progressively stronger effect, while high and very high prices remain less attractive.
- Product posters and the new cardboard figures can influence matching product choices when customers actually see them. Poster, figure, flyer, mascot, and window-display results are tracked as separate evidence in Store Reports.
- Release-seeking customers can consider a substitute without losing the correct “release not found” reason when they refuse it.
- Improved exact shelf and display-booth arrival, checkout queue spacing, paid-customer exit protection, payment recovery, and route cleanup to reduce snapping, stalls, line theft, and repeated shopping after checkout.
- Customer emoji feedback is now paired with facial reactions. Regular customers blink, change expressions with their reactions, and use more natural eye contact and nearby-customer glances.
- Customer feedback is clearer and more actionable, with named customers where available and better explanations for checkout delays, missing products, trash, stains, obstructing boxes, and other store conditions.
- Reworked **Kitty** to use the shared navigation system, follow its owner more reliably across navigation areas, recover safely when separated, synchronize movement animations, and preserve its ambient meow behavior.
- Old saves migrate through additive, recoverable population data without replacing the existing customer, inventory, transaction, or store-state files.

## Performance and Stability

- Regular NPCs now use pooling instead of repeated creation and destruction. Every pooled customer receives a complete reset of navigation, cart, queue, audio, reaction, highlight, animation, and identity state before reuse.
- Added distance-based NPC update tiers. Nearby customers retain full presentation, mid-distance customers reduce cosmetic work, and distant off-screen customers update less often with animator culling.
- NPC proximity and right-of-way checks now use one budgeted spatial pass rather than many independent searches and physics interactions.
- Customer appearances and animators are warmed under the **Customers population** loading phase. First-use costs for every common visual are paid behind the loading cover instead of during visible gameplay.
- New games warm the required visuals but let pedestrians arrive naturally from the four city corners after the introduction. Continued games restore a moving city under the loading cover without replaying old visits or transactions.
- Initial population activation is spread across frames, preventing a complete crowd from initializing in one spike.
- Delivery-box content needed by the current save and pending orders is prepared during loading. Unrelated and unreleased catalog assets remain unloaded to protect memory.
- Checkout autosaves now capture only transaction-owned data, spread capture work across frames, coalesce rapid sales, and write immutable snapshots through one background writer. Manual saves, exits, and day transitions still flush a complete save.
- Automatic checkout saves no longer capture a new save-slot preview image every time.
- Store Report history is limited to the newest 25 report days, and live report updates avoid repeatedly serializing the entire history during active gameplay.
- NPC diagnostic serialization and file writing were moved off the main gameplay thread, with bounded failure handling that cannot freeze simulation or saving.
- Timeline and Gamedex construction now use frame budgets and incremental loading to reduce menu-opening spikes, especially on constrained hardware.
- Added automatic hardware recommendations for constrained, mainstream, and high-end systems, plus an Apply Recommended Settings preview.
- Added separate settings for post-processing, ambient occlusion, realtime reflections, performance warnings, and automatic optimization.
- The game now monitors sustained frame-pacing problems and can offer recommended settings without silently changing the player's configuration.
- Steam Deck receives a dedicated renderer and memory profile, native-resolution guidance, reduced shadow and visual-effect recommendations, and leaves frame limiting to SteamOS/Gamescope.
- Improved shader precompilation and startup warm-up to reduce first-use shader stalls.
- Removed legacy NPC build content, reduced unnecessary rendering work such as moon shadows and LOD cross-fades, and hardened reflection, audio, navigation, and teardown paths against repeated warnings and shutdown-only errors.

## Store Reports — More Detail, Better Decisions

- Rebuilt Store Reports around a clearer **Day at a Glance** overview with Revenue, Total Expenses, Estimated Profit, Store Rating, and Satisfied Customers.
- Added previous-report-day comparisons so financial changes explain their baseline instead of showing unexplained signed values.
- Added full-page drill-downs with nested detail pages, automatic scrolling, focus restoration, day switching, and complete mouse, keyboard, and gamepad support.
- Added detailed views for customer funnel, lost sales, profit and margin, inventory value, individual stocked products, market price, utilities, employee output, promotion effectiveness, Voice of Customer, and bonus-card effectiveness.
- The customer funnel separates street passers, store entries, completed purchases, checkout dropouts, entry rate, purchase conversion, and dropout rate.
- Product analysis now includes recorded selling price, estimated wholesale cost and gross profit, units sold, remaining inventory, demand, unavailable requests, and totals through the selected report day.
- Promotion Effectiveness separately tracks flyers, mascot interactions, window displays, product posters, and cardboard figures. It distinguishes opportunities, accepted choices, physical entries, purchases, and units instead of inferring success from proximity.
- Voice of Customer groups actual delivered feedback and reactions by importance, reason, product, count, and last occurrence.
- Bonus Card Effectiveness explains the promise, applied mechanic, and completed result for every active card, including cards that had no eligible event that day.
- Employee reports now cover checkout completions, flyers delivered, messes cleaned, repairs completed, restock units moved, assignments, wages, and roster information without duplicating flyer totals.
- Current-day report data now survives mid-day saves and continues additively after loading, avoiding resets, replay, and double counting.
- End-of-day reports reconcile again before rollover so post-close repairs, expenses, employee work, utilities, inventory, and balance remain accurate.

## Save Games, Cloud, Mods, and Sandbox

- Added **three save slots**, each with its own store preview, playtime, cash, year/day, level, rating, game mode, Simulation Mode, mod status, and Established Store badge.
- Added overwrite, delete, corrupt-save, missing-mod, and mod-mismatch handling to the save selector.
- Updated Steam Auto-Cloud support for all three slots and their preview images on Windows and SteamOS/Linux. Graphics, audio, language, resolution, and controls remain device-local.
- Existing released saves migrate into the new slot layout through recoverable staging. Synchronized deletion markers prevent an intentionally deleted save from being restored by an older cloud folder.
- Each slot can independently use the vanilla game, a local mod, or a Steam Workshop mod. Changing a slot's mod creates a backup before its save data is updated.
- Updated **GSC Mod Studio** to recognize the three-slot layout, assigned per-slot mods, local and Workshop sources, deletion markers, and the new save-location rules.
- Added **Sandbox Mode** as a new-save option. Sandbox tools can change the date, money, store level, rating, and order delivery state.
- Added a dedicated Sandbox NPC Population page with Easy, Standard, Hard, and Custom profiles, density and capacity controls, live application, and diagnostics controls.
- Sandbox and Standard games use the same complete tutorial and opening flow. Sandbox progression is clearly marked and does not earn the Established Store stamp.

## Boost Cards, Progression, and HUD

- Added five boost cards: **VIP Magnet** for special-customer chance, **Bigger Baskets** for larger purchases, **Store Shield** for reduced mess and wear, **Power Saver** for electricity discounts, and **Rent Relief** for store and backroom rent discounts.
- Existing boosts for more customers, discounted product orders, faster delivery, and extra XP were integrated into the same unified nine-card system.
- Level-up rewards now use a card-and-duration roulette flow, including a jackpot result.
- Active boosts now have a dedicated HUD/radial-menu panel with icons, stacked values, and days remaining.
- Added the **Established Store** stamp to qualifying Standard save slots. Its three visual stages recognize sustained operation, employee progression, later generations, and limited skipped days.
- Reworked the HUD **Progress Indicator** beneath balance and rating. Sale income, XP, spending, and rating changes appear only when active, remain readable for five seconds, then fade independently.
- Repeated spending is combined into the current SPENT total and restarts its readable timer. Beginning-of-day rent, backroom rent, mascot cost, and paid wages appear as one deferred total after transition and release screens are clear.
- Added animated number changes across key HUD and menu surfaces for clearer feedback.
- Added new semantic icons for boosts, reports, Sandbox actions, command bindings, and rating stars.

## Catalog, Store, and Presentation

- Added separate **Games, Consoles, Accessories, and Store Assets** catalog filters, clearer selected-item highlighting, and improved gamepad filter navigation.
- Added optional paid **Fast Delivery** for eligible catalog orders. The service costs 15% of the eligible order value and delivers after one in-game hour or by closing time, whichever comes first.
- Fast Delivery clearly explains unavailable carts, preorders, mixed orders, delivery timing, and fees. The Instant Delivery boost remains a separate free bonus effect.
- Confirmed the **Mintenbo Pistol** as a catalog product with its accessory preview and progression requirements.
- Added placeable console-family **cardboard merchandise figures**. Figures can be placed, rotated, switched, repositioned, or discarded and can promote nearby matching-family products.
- The greeter flyer is now visible before level 8 with a clear locked message, making the future feature discoverable.
- Added the Employee guide to the Guides page and refreshed related gameplay guidance.
- Improved poster placement on doors and glass so posters align and render correctly on storefront surfaces.
- Billboards now change their artwork automatically as console releases and generations advance.
- Added the new blue, generation-aware **Generation 3 checkout counter**, which replaces the compatible counter presentation when Generation 3 is reached while preserving the checkout's saved state and employee use.
- Reworked the customer dossier. Interacting with a customer now opens a focused profile with portrait, age, visits, last visit, store rating, five personality traits, owned products, and a comparison between that customer and a selected product's ideal audience.
- Product profile comparisons now respond to genre, category, platform, supplier, release timing, price, and current market context, with safe support for legacy saves and owned-product edge cases.

## Graphics, Controls, Localization, and Polish

- Added optional realtime storefront reflections and a dedicated graphics setting.
- Rebalanced the full day/night lighting cycle with improved indoor daylight, sunset and morning color, wall and ceiling shading, contact shadows, ambient occlusion, probe seams, and progressive retro color grading.
- Improved storefront and interior depth while reducing costly or distracting moon shadows and ceiling artifacts.
- Added complete **Spanish language support** across the game's localization tables, alongside further German corrections and translation maintenance for existing languages.
- Expanded command-binding glyph coverage and improved controller prompts throughout reports, save selection, Sandbox, catalog, checkout, customer dossiers, settings, and system dialogs.
- Improved gamepad focus restoration, Cancel/Back behavior, directional navigation, right-stick scrolling, checkout payment input, and pause/system-button handling.
- Refined catalog, Gamedex, reports, level-up, save-slot, settings, rating, notification, and radial-menu presentation.
- Fixed multiple loading, navigation, checkout, booth, store-closing, employee repair, highlight, reflection, audio, save migration, and teardown edge cases.

