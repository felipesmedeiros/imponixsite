import telemetryManifest from '../external/catalog.json' with { type: 'json' };
import multiplayerAchievements from './multiplayer-achievements.json' with { type: 'json' };
export const TELEMETRY_STATS = telemetryManifest.stats;
export const APP_ID = 3463400;
export const STATS_URL = 'https://api.steampowered.com/ISteamUserStats/GetGlobalStatsForGame/v1/';
export const ACHIEVEMENTS_URL = 'https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/';
const stat = (key, label, group, unit, description, caution = '') => ({ key, label, group, unit, description, caution });
export const STATS = [
  stat('PRODUCTS_SOLD', 'Products sold', 'Sales', 'units', 'Units recorded by TimelineManager checkout progression.'),
  stat('CUSTOMERS_SATISFIED', 'Satisfied customers', 'Sales', 'customers', 'Successful satisfied-customer outcomes; repeat customers and repeat accounts contribute.'),
  stat('SPECIAL_CUSTOMERS_SATISFIED', 'Special customers satisfied', 'Sales', 'customers', 'Satisfied special-customer outcomes.'),
  stat('NEW_GAME', 'New games started', 'Sessions', 'starts', 'New-game actions recorded by MenuController.', 'Repeated starts count again. This is not a unique-player denominator.'),
  stat('CONTINUE_GAME', 'Games continued', 'Sessions', 'loads', 'Continue/load actions recorded by MenuController.', 'Loads are not unique accounts or validated play sessions.'),
  stat('DAYS_PLAYED', 'Days played stat', 'Progress', 'days', 'Sum of the current per-account DAYS_PLAYED values.', 'Resets on New Game. This is not lifetime days played or retention.'),
  stat('DAYS_SKIPPED', 'Days skipped stat', 'Progress', 'days', 'Sum of the current per-account DAYS_SKIPPED values.', 'Resets on New Game; negative snapshot changes are possible.'),
  stat('ALPHA_TEST_FINISHED', 'Legacy alpha completion', 'Legacy', 'events', 'Legacy completion events in DayNightCycle.', 'Historical instrumentation; not the completion rate of the current full game.'),
  stat('EMPLOYEE_CHECKOUTS', 'Employee checkouts', 'Staff', 'checkouts', 'Checkout activity completed by staff.'),
  stat('EMPLOYEE_RESTOCK_UNITS', 'Employee restock units', 'Staff', 'units', 'Units restocked by employees.'),
  stat('GAMEDEX_ENTRIES', 'GameDex entries', 'Discovery', 'entries', 'GameDex progression recorded by TimelineManager.', 'Steam reported this stat as not aggregated during the initial audit. Repeat-account behavior needs review before calling these distinct discoveries.'),
  stat('ESTABLISHED_STORES', 'Established stores', 'Progress', 'stores', 'Store-establishment progression recorded by GameManager.', 'Counts stores/events, not necessarily unique accounts. Development test seeds can contribute.'),
  stat('USED_PRODUCTS_RECIRCULATED', 'Used products recirculated', 'Pre-owned', 'units', 'Completed pre-owned sales synchronized through SecondHandMarketService.'),
  stat('BARGAIN_BIN_PRODUCTS_SOLD', 'Bargain-bin products sold', 'Pre-owned', 'units', 'Units sold through the bargain-bin progression path.', 'Steam reported this stat as not aggregated during the initial audit.'),
];
const achievement = (key, label, group, description) => ({ key, label, group, description });
export const ACHIEVEMENTS = [
  achievement('STORE_FIRST_SALE', 'First sale', 'Opening', 'Recorded a successful product sale.'),
  achievement('CUSTOMER_10_SATISFIED', '10 satisfied customers', 'Opening', 'Reached the satisfied-customer achievement threshold.'),
  achievement('LEVEL_UP_3', 'Level 3', 'Opening', 'Reached store level 3.'),
  achievement('STORE_CHANGE_NAME', 'Named the store', 'Opening', 'Changed the store name.'),
  achievement('SPECIAL_CUSTOMER_SATISFIED', 'Special customer served', 'Store quality', 'Satisfied a special customer.'),
  achievement('STORE_PERFECT_DAY', 'Perfect day', 'Store quality', 'Earned the perfect-day achievement.'),
  achievement('STORE_RATING_48', 'Rating 4.8', 'Store quality', 'Earned the store-rating achievement.'),
  achievement('EMPLOYEE_FIRST_HIRE', 'First employee hired', 'Staff', 'Successfully hired an employee.'),
  achievement('EMPLOYEE_CHECKOUT_25', '25 employee checkouts', 'Staff', 'Reached 25 recorded staff checkouts.'),
  achievement('EMPLOYEE_RESTOCK_100', '100 employee restock units', 'Staff', 'Reached 100 recorded staff restock units.'),
  achievement('STAFF_FULL_HOUSE', 'Full staff', 'Staff', 'Earned the full-staff achievement.'),
  achievement('EMPLOYEE_FIRST_DISMISS', 'Dismissed an employee', 'Staff', 'Dismissed an employee.'),
  achievement('EMPLOYEE_INTERRUPT_BREAK', 'Interrupted a break', 'Staff', 'Interrupted an employee break.'),
  achievement('STORE_PRODUCTS_1000', '1,000 products sold', 'Depth', 'Reached 1,000 recorded product sales.'),
  achievement('STORE_DAYS_30', '30 store days', 'Depth', 'Earned the 30-store-days achievement.'),
  achievement('STORE_FIRST_EXPANSION', 'First store expansion', 'Depth', 'Completed a first store expansion.'),
  achievement('STORE_FULL_EXPANSION', 'Fully expanded store', 'Depth', 'Completed the full-expansion achievement.'),
  achievement('STORE_ESTABLISHED', 'Established store', 'Depth', 'Earned the store-establishment achievement.'),
  achievement('GENERATION_CHANGE_2', 'Generation 2', 'Timeline', 'Reached generation 2.'),
  achievement('GENERATION_CHANGE_3', 'Generation 3', 'Timeline', 'Reached generation 3.'),
  achievement('GENERATION_CHANGE_4', 'Generation 4', 'Timeline', 'Reached generation 4.'),
  achievement('SECOND_LIFE', 'First used product recirculated', 'Pre-owned', 'Reached one recorded pre-owned sale.'),
  achievement('CIRCULAR_ECONOMY', '25 used products recirculated', 'Pre-owned', 'Reached 25 recorded pre-owned sales.'),
  achievement('BARGAIN_BIN_100', '100 bargain-bin sales', 'Pre-owned', 'Reached 100 recorded bargain-bin units sold.'),
  achievement('GAMEDEX_25', '25 GameDex entries', 'Discovery', 'Earned the GameDex entry achievement.'),
  achievement('GAMEDEX_GENERATION_COMPLETE', 'Completed a GameDex generation', 'Discovery', 'Earned the generation collection achievement.'),
  achievement('EASTER_EGG_1', 'Back-alley discovery', 'Discovery', 'Discovered the back-alley achievement.'),
  achievement('FINISHED_DEMO', 'Legacy demo completed', 'Legacy', 'Demo achievement defined in the shared runtime; may be absent on the full-game App ID.'),
];
STATS.push(...TELEMETRY_STATS);
ACHIEVEMENTS.push(...multiplayerAchievements.map(a => achievement(a.key, a.copy.en[0], 'Multiplayer', a.copy.en[1])));
export const COVERAGE = 'Single-player achievements exclude Sandbox and transient guests. The three multiplayer achievements include both roles and modes. Observatory v1 progression covers newly measured Standard stores; multiplayer covers both roles and modes. Global results mix public and pre-release builds.';
export const GROUPS = [...new Set(ACHIEVEMENTS.map(a => a.group))];
export const PROGRESS_KEYS = ['STORE_FIRST_SALE', 'CUSTOMER_10_SATISFIED', 'LEVEL_UP_3', 'EMPLOYEE_FIRST_HIRE', 'STORE_PRODUCTS_1000', 'STORE_DAYS_30', 'STORE_FIRST_EXPANSION', 'STORE_ESTABLISHED'];
