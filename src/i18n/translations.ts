/**
 * Bilingual UI strings (Hindi primary, English secondary).
 * Data-derived content (event titles from USGS/NASA) stays in the source
 * language; only chrome/labels are translated here.
 */

export type Lang = 'hi' | 'en';

export interface LangStrings {
  hi: string;
  en: string;
}

export const STRINGS = {
  // Brand
  'brand.name': { hi: 'अर्थवॉच', en: 'EarthWatch' },
  'brand.tagline': { hi: 'अपने ग्रह को देखें। अपनी धरती को समझें।', en: 'Monitor Our Planet. Understand Our Earth.' },

  // Primary call to action
  'cta.primary': { hi: '🌍 धरती पर क्या हो रहा है?', en: '🌍 What is happening on Earth?' },
  'cta.primary.sub': {
    hi: 'नीचे दबाकर ताज़ा जानकारी देखें',
    en: 'Tap below to see the latest',
  },

  // Navigation
  'nav.home': { hi: '🏠 होम', en: '🏠 Home' },
  'nav.map': { hi: '🌎 दुनिया का नक्शा', en: '🌎 World Map' },
  'nav.earthquakes': { hi: '🌋 भूकंप', en: '🌋 Earthquakes' },
  'nav.wildfires': { hi: '🔥 जंगल की आग', en: '🔥 Wildfires' },
  'nav.storms': { hi: '🌪️ तूफान', en: '🌪️ Storms' },
  'nav.floods': { hi: '🌊 बाढ़', en: '🌊 Floods' },
  'nav.satellite': { hi: '🛰️ धरती की तस्वीरें', en: '🛰️ Earth Photos' },
  'nav.analytics': { hi: '📊 जानकारी', en: '📊 Insights' },
  'nav.help': { hi: 'ℹ️ मदद', en: 'ℹ️ Help' },
  'nav.about': { hi: 'बारे में', en: 'About' },
  'nav.description.home': { hi: 'मुख्य सारांश', en: 'Global overview' },
  'nav.description.map': { hi: 'पूरी दुनिया का नक्शा', en: 'Whole-world map' },
  'nav.description.earthquakes': { hi: 'USGS भूकंप डेटा', en: 'USGS seismic data' },
  'nav.description.wildfires': { hi: 'FIRMS व EONET आग', en: 'FIRMS & EONET fires' },
  'nav.description.storms': { hi: 'तूफान की घटनाएँ', en: 'Severe storms' },
  'nav.description.floods': { hi: 'बाढ़ की घटनाएँ', en: 'Flood events' },
  'nav.description.satellite': { hi: 'NASA गिब्स व तस्वीरें', en: 'GIBS & APOD' },
  'nav.description.analytics': { hi: 'आँकड़े व निर्यात', en: 'Trends & export' },
  'nav.description.help': { hi: 'उपयोग का तरीका', en: 'How to use' },

  // Common buttons / labels
  'common.refresh': { hi: 'फिर से जानकारी लाएँ', en: 'Refresh' },
  'common.refreshAll': { hi: 'सारी जानकारी ताज़ा करें', en: 'Refresh all' },
  'common.search': { hi: 'खोजें', en: 'Search' },
  'common.searchPlaceholder': { hi: 'घटना, जगह या प्रकार से खोजें…', en: 'Search by title, place, or category…' },
  'common.clear': { hi: 'फ़िल्टर हटाएँ', en: 'Clear filters' },
  'common.close': { hi: 'बंद करें', en: 'Close' },
  'common.loading': { hi: 'लोड हो रहा है…', en: 'Loading…' },
  'common.retry': { hi: 'फिर कोशिश करें', en: 'Try again' },
  'common.viewSource': { hi: 'स्रोत देखें', en: 'View source' },
  'common.listen': { hi: '🔊 और जानकारी सुनें', en: '🔊 Listen to details' },
  'common.stopListening': { hi: '⏹ रोकें', en: '⏹ Stop' },
  'common.publicData': { hi: 'सार्वजनिक डेटा', en: 'Public data' },
  'common.openMenu': { hi: 'मेन्यू खोलें', en: 'Open navigation menu' },
  'common.expandSidebar': { hi: 'साइडबार बड़ा करें', en: 'Expand sidebar' },
  'common.collapseSidebar': { hi: 'साइडबार छोटा करें', en: 'Collapse sidebar' },
  'common.openSearch': { hi: 'खोज खोलें', en: 'Open global search' },
  'common.languageSwitch': { hi: 'भाषा बदलें', en: 'Switch language' },
  'common.lang.hi': { hi: 'हिं', en: 'हिं' },
  'common.lang.en': { hi: 'EN', en: 'EN' },

  // Status / freshness
  'status.live': { hi: 'लाइव', en: 'Live' },
  'status.error': { hi: 'त्रुटि', en: 'Error' },
  'status.idle': { hi: 'रुका हुआ', en: 'Idle' },
  'status.connecting': { hi: 'जुड़ रहा है', en: 'Connecting' },
  'status.cached': { hi: 'पुरानी जानकारी', en: 'Cached' },
  'status.updated': { hi: 'अंतिम अपडेट', en: 'Last update' },
  'status.awaiting': { hi: 'पहली जानकारी की प्रतीक्षा', en: 'Awaiting first update' },
  'status.connected': { hi: 'सभी स्रोत जुड़े', en: 'All sources connected' },
  'status.partialOutage': { hi: 'कुछ स्रोत उपलब्ध नहीं', en: 'Partial outage' },
  'status.unavailable': { hi: 'उपलब्ध नहीं', en: 'Unavailable' },
  'status.stale': { hi: 'पुराना', en: 'Stale' },
  'status.connected2': { hi: 'जुड़ा हुआ', en: 'Connected' },
  'status.records': { hi: 'रिकॉर्ड', en: 'records' },
  'status.notConfigured': { hi: 'सेट नहीं है', en: 'Not configured' },

  // Dashboard
  'dash.heroBadge': { hi: 'लाइव निगरानी', en: 'Live monitoring' },
  'dash.heroSubtitle': {
    hi: 'भूकंप, जंगल की आग, प्राकृतिक घटनाएँ और उपग्रह तस्वीरें — सार्वजनिक डेटा से, बिना किसी मनगढ़ंत आँकड़े के।',
    en: 'Real-time view of earthquakes, wildfires, natural events, and satellite imagery from public agency data — no fabricated data.',
  },
  'dash.globalMap': { hi: 'दुनिया का नक्शा', en: 'Global events map' },
  'dash.recentEvents': { hi: 'हाल की घटनाएँ', en: 'Recent events' },
  'dash.totalIndexed': { hi: 'कुल रिकॉर्ड', en: 'total indexed' },
  'dash.mapBelowNote': {
    hi: 'नक़्शे के नीचे सभी घटनाओं की सुलभ सूची उपलब्ध है।',
    en: 'An accessible list of all mapped events appears below.',
  },
  'dash.eventsByCategory': { hi: 'श्रेणी अनुसार घटनाएँ', en: 'Events by source category' },
  'dash.eventsByCategoryShort': { hi: 'घटनाएँ श्रेणी अनुसार', en: 'Events by category' },

  // Summary cards
  'card.earthquakes': { hi: 'भूकंप', en: 'Earthquakes' },
  'card.earthquakesSrc': { hi: 'USGS · पिछले 24 घंटे', en: 'USGS · past 24h feed' },
  'card.fires': { hi: 'सक्रिय आग की पहचान', en: 'Active fire detections' },
  'card.firesSrc': { hi: 'NASA FIRMS · पिछले 24 घंटे', en: 'NASA FIRMS · last 24h' },
  'card.firesNotCfg': { hi: 'FIRMS सेट नहीं है', en: 'FIRMS not configured' },
  'card.firesAddKey': { hi: 'VITE_FIRMS_MAP_KEY जोड़ें', en: 'Add VITE_FIRMS_MAP_KEY' },
  'card.naturalEvents': { hi: 'खुली प्राकृतिक घटनाएँ', en: 'Open natural events' },
  'card.naturalEventsSrc': { hi: 'NASA EONET · खुली घटनाएँ', en: 'NASA EONET · open events' },
  'card.satellite': { hi: 'उपग्रह तस्वीर की परतें', en: 'Satellite imagery layers' },
  'card.satelliteSrc': { hi: 'NASA GIBS · सार्वजनिक WMTS', en: 'NASA GIBS · public WMTS' },
  'card.satelliteHint': { hi: 'कुंजी आवश्यक नहीं · NASA APOD सहित', en: 'No key required · plus NASA APOD' },
  'card.sourceUnavailable': { hi: 'स्रोत उपलब्ध नहीं', en: 'Source unavailable' },
  'card.awaitingData': { hi: 'डेटा की प्रतीक्षा', en: 'Awaiting data' },
  'card.largest': { hi: 'सबसे बड़ा', en: 'Largest' },
  'card.categoriesTracked': { hi: 'श्रेणियाँ ट्रैक की जा रही हैं', en: 'categories tracked' },

  // Monitoring status
  'monitor.title': { hi: 'निगरानी स्थिति', en: 'Monitoring status' },
  'monitor.usgs': { hi: 'USGS भूकंप', en: 'USGS Earthquakes' },
  'monitor.usgsDesc': { hi: 'earthquake.usgs.gov · पिछले 24 घंटे', en: 'earthquake.usgs.gov · past 24h feed' },
  'monitor.eonet': { hi: 'NASA EONET', en: 'NASA EONET' },
  'monitor.eonetDesc': { hi: 'eonet.gsfc.nasa.gov · खुली घटनाएँ', en: 'eonet.gsfc.nasa.gov · open events' },
  'monitor.firms': { hi: 'NASA FIRMS', en: 'NASA FIRMS' },
  'monitor.firmsDesc': { hi: 'firms.modaps.eosdis.nasa.gov · आग की पहचान', en: 'firms.modaps.eosdis.nasa.gov · fire detections' },
  'monitor.gibs': { hi: 'NASA GIBS', en: 'NASA GIBS' },
  'monitor.gibsDesc': { hi: 'gibs.earthdata.nasa.gov · सार्वजनिक तस्वीरें', en: 'gibs.earthdata.nasa.gov · public tiles (no key)' },
  'monitor.noteFailVsZero': {
    hi: 'विफल अनुरोध कभी शून्य घटनाएँ नहीं दर्शाता — वह “उपलब्ध नहीं” या “पुराना” दिखता है।',
    en: 'A failed request never shows as zero events — it shows “Unavailable” or “Stale”.',
  },

  // Map
  'map.layers': { hi: 'परतें', en: 'Layers' },
  'map.satelliteImagery': { hi: 'उपग्रह तस्वीरें', en: 'Satellite imagery' },
  'map.coordinates': { hi: 'माउस हिलाएँ निर्देशांक के लिए', en: 'Move cursor for coordinates' },
  'map.basemap': { hi: 'नक्शा परत', en: 'Basemap' },
  'map.shown': { hi: 'दिखाई', en: 'shown' },
  'map.loadingEvents': { hi: 'घटनाएँ लोड हो रही हैं…', en: 'Loading events…' },
  'map.contentsLabel': { hi: 'नक़्शे की सामग्री', en: 'Map contents' },
  'map.contentsIntro': {
    hi: 'इंटरैक्टिव विश्व नक्शा जो {n} घटनाएँ दिखाता है।',
    en: 'Interactive world map showing {n} events.',
  },
  'map.listAvailableBelow': {
    hi: 'नक़्शे के नीचे इन घटनाओं की खोज योग्य सूची उपलब्ध है।',
    en: 'A searchable table of these events is available below the map.',
  },
  'map.events': { hi: 'घटनाएँ', en: 'events' },
  'map.loadingTiles': { hi: 'नक्शा लोड हो रहा है…', en: 'Loading map tiles…' },
  'map.tileError': {
    hi: 'नक़्शे की टाइलें लोड नहीं हो सकीं। इंटरनेट कनेक्शन जाँचें।',
    en: 'Map tiles failed to load. Check your connection.',
  },
  'map.zoomIn': { hi: 'ज़ूम इन', en: 'Zoom in' },
  'map.zoomOut': { hi: 'ज़ूम आउट', en: 'Zoom out' },

  // Event popup / detail
  'detail.title': { hi: 'घटना विवरण', en: 'Event details' },
  'detail.detected': { hi: 'समय', en: 'Detected' },
  'detail.coords': { hi: 'निर्देशांक', en: 'Coordinates' },
  'detail.magnitude': { hi: 'तीव्रता', en: 'Magnitude' },
  'detail.value': { hi: 'मान', en: 'Value' },
  'detail.depth': { hi: 'गहराई', en: 'Depth' },
  'detail.confidence': { hi: 'विश्वसनीयता', en: 'Confidence' },
  'detail.category': { hi: 'श्रेणी', en: 'Category' },
  'detail.geometries': { hi: 'अवलोकन', en: 'Geometries' },
  'detail.satellite': { hi: 'उपग्रह', en: 'Satellite' },
  'detail.reportedBy': { hi: 'सूचना दी', en: 'Reported by' },
  'detail.acquired': { hi: 'प्राप्ति', en: 'Acquired' },
  'detail.dayNight': { hi: 'दिन/रात', en: 'Day/Night' },
  'detail.brightTi4': { hi: 'चमक TI4', en: 'Bright TI4' },
  'detail.firePower': { hi: 'आग की शक्ति', en: 'Fire power' },
  'detail.alert': { hi: 'PAGER चेतावनी', en: 'PAGER alert' },
  'detail.tsunami': { hi: 'सुनामी', en: 'Tsunami' },
  'detail.tsunamiFlag': { hi: 'संभावित — USGS ने चिह्नित किया', en: 'Potential — flagged by USGS' },
  'detail.closed': { hi: 'बंद', en: 'Closed' },
  'detail.unknown': { hi: 'अज्ञात', en: 'Unknown' },
  'detail.dateUnknown': { hi: 'तारीख अज्ञात', en: 'Date unknown' },
  'detail.source': { hi: 'स्रोत', en: 'Source' },
  'detail.km': { hi: 'किमी', en: 'km' },
  'detail.kmDeep': { hi: 'किमी गहरा', en: 'km deep' },
  'detail.confSuffix': { hi: '% विश्वसनीय', en: '% conf' },
  'detail.observations': { hi: 'अवलोकन', en: 'observation(s)' },
  'detail.day': { hi: 'दिन', en: 'Day' },
  'detail.night': { hi: 'रात', en: 'Night' },

  // Table
  'table.type': { hi: 'प्रकार', en: 'Type' },
  'table.time': { hi: 'समय', en: 'Time' },
  'table.location': { hi: 'जगह / शीर्षक', en: 'Location / Title' },
  'table.magValue': { hi: 'तीव्रता / मान', en: 'Mag / Value' },
  'table.source': { hi: 'स्रोत', en: 'Source' },
  'table.sortTime': { hi: 'क्रम: समय', en: 'Sort: Time' },
  'table.sortMag': { hi: 'क्रम: तीव्रता', en: 'Sort: Magnitude' },
  'table.ascending': { hi: 'असेंडिंग', en: 'ascending' },
  'table.descending': { hi: 'डिसेंडिंग', en: 'descending' },
  'table.minMagnitude': { hi: 'न्यूनतम तीव्रता', en: 'Minimum magnitude' },
  'table.noMatches': { hi: 'वर्तमान फ़िल्टर से कोई घटना मेल नहीं खाती।', en: 'No events match the current filters.' },
  'table.prev': { hi: 'पिछला', en: 'Prev' },
  'table.next': { hi: 'अगला', en: 'Next' },
  'table.showing': { hi: 'दिखाई', en: 'Showing' },
  'table.of': { hi: 'में से', en: 'of' },
  'table.page': { hi: 'पृष्ठ', en: 'page' },
  'table.openSource': { hi: 'स्रोत खोलें', en: 'Open source' },
  'table.clickToSelect': { hi: 'विवरण देखने के लिए क्लिक करें', en: 'Click row for details' },

  // Empty / error states
  'empty.noMatches': { hi: 'कोई मिलान नहीं', en: 'No matches' },
  'empty.noMatchesDesc': { hi: 'कोई दूसरा नाम या श्रेणी आज़माएँ।', en: 'Try a different place name or category.' },
  'empty.startTyping': { hi: 'खोजने के लिए लिखना शुरू करें', en: 'Start typing to search' },
  'empty.searchHint': {
    hi: 'नतीजे इस सत्र में पहले से लाई गई घटनाओं से आते हैं।',
    en: 'Results draw from events already fetched in this session.',
  },
  'error.title': { hi: 'कुछ गड़बड़ हो गई', en: 'Something went wrong' },
  'error.sourceUnavailable': { hi: 'डेटा स्रोत उपलब्ध नहीं', en: 'Data source unavailable' },
  'error.broke': { hi: 'कुछ टूट गया', en: 'Something broke' },
  'error.renderError': {
    hi: 'यह स्क्रीन दिखाते समय एक अप्रत्याशित त्रुटि हुई।',
    en: 'An unexpected error occurred while rendering this view.',
  },

  // Charts
  'chart.magDist': { hi: 'भूकंप तीव्रता वितरण', en: 'Earthquake magnitude distribution' },
  'chart.magDistSub': { hi: 'लोड किए गए USGS डेटा में तीव्रता अनुसार घटनाएँ', en: 'Count of events by magnitude band (from loaded USGS data)' },
  'chart.noQuake': { hi: 'भूकंप डेटा नहीं', en: 'No earthquake data loaded' },
  'chart.noQuakeDesc': { hi: 'USGS डेटा लोड होने पर तीव्रता दिखेगी।', en: 'Earthquake magnitudes will appear once USGS data loads.' },
  'chart.trend': { hi: 'घटना प्रवृत्ति', en: 'Event trend' },
  'chart.trendSub': { hi: 'लोड किए गए रिकॉर्ड से पिछले {n} दिन', en: 'Daily counts over the last {n} days (from loaded records)' },
  'chart.noTrend': { hi: 'प्रवृत्ति डेटा नहीं', en: 'No trend data' },
  'chart.noTrendDesc': {
    hi: 'घटनाएँ लोड होने पर दैनिक प्रवृत्ति यहाँ दिखेगी। लोड किए फ़ीड सीमित इतिहास कवर करते हैं।',
    en: 'Once events load, a daily trend will appear here. Note: loaded feeds cover limited history.',
  },
  'chart.eventsLabel': { hi: 'घटनाएँ', en: 'events' },

  // Earthquakes page
  'eq.title': { hi: 'भूकंप', en: 'Earthquakes' },
  'eq.subtitle': {
    hi: 'USGS भूकंप खतरा कार्यक्रम — earthquake.usgs.gov से वास्तविक डेटा',
    en: 'USGS Earthquake Hazards Program — real seismic data from earthquake.usgs.gov',
  },
  'eq.window.hour': { hi: 'पिछला घंटा', en: 'Past hour' },
  'eq.window.day': { hi: 'पिछले 24 घंटे', en: 'Past 24 hours' },
  'eq.window.week': { hi: 'पिछले 7 दिन', en: 'Past 7 days' },
  'eq.window.month': { hi: 'पिछले 30 दिन', en: 'Past 30 days' },
  'eq.magLegend': { hi: 'तीव्रता किंवदंती', en: 'Magnitude legend' },
  'eq.largest': { hi: 'इस अवधि का सबसे बड़ा', en: 'Largest this window' },
  'eq.attribution': { hi: 'USGS भूकंप API (fdsnws/event/1)', en: 'USGS Earthquake API (fdsnws/event/1)' },
  'eq.note': {
    hi: 'डेटा © USGS भूकंप खतरा कार्यक्रम। बड़ी संख्या में छोटी तीव्रता की घटनाएँ होती हैं; निष्पादन के लिए नक़्शे पर मार्कर सीमित हैं।',
    en: 'Data © USGS Earthquake Hazards Program. Smaller-magnitude events dominate the feed; the map caps displayed markers for performance.',
  },

  // Wildfires page
  'fire.title': { hi: 'जंगल की आग', en: 'Wildfires' },
  'fire.subtitle': {
    hi: 'NASA FIRMS से सक्रिय आग की पहचान और NASA EONET से आग की घटनाएँ',
    en: 'Active fire detections from NASA FIRMS and wildfire events from NASA EONET',
  },
  'fire.source.VIIRS_SNPP': { hi: 'VIIRS सुओमी-NPP', en: 'VIIRS Suomi-NPP' },
  'fire.source.VIIRS_NOAA20': { hi: 'VIIRS NOAA-20', en: 'VIIRS NOAA-20' },
  'fire.source.MODIS': { hi: 'MODIS टेरा/एक्वा', en: 'MODIS Terra/Aqua' },
  'fire.days.1': { hi: 'पिछले 24 घंटे', en: 'Last 24 hours' },
  'fire.days.2': { hi: 'पिछले 48 घंटे', en: 'Last 48 hours' },
  'fire.days.3': { hi: 'पिछले 72 घंटे', en: 'Last 72 hours' },
  'fire.detectionSource': { hi: 'पहचान स्रोत', en: 'Detection source' },
  'fire.lookback': { hi: 'अवधि', en: 'Look-back period' },
  'fire.notConfiguredTitle': { hi: 'NASA FIRMS सेट नहीं है', en: 'NASA FIRMS not configured' },
  'fire.notConfiguredDesc': {
    hi: 'निकट-वास्तविक-समय की आग की पहचान के लिए एक मुफ़्त FIRMS MAP_KEY चाहिए। नीचे फिर भी NASA EONET से वास्तविक आग की घटनाएँ दिख रही हैं। उच्च-रिज़ॉल्यूशन पहचान के लिए कुंजी जोड़ें।',
    en: 'Near-real-time fire detections require a free FIRMS MAP_KEY. The page below is still showing real, public wildfire events from NASA EONET. Add a key to enable FIRMS high-resolution active-fire detections.',
  },
  'fire.step1': { hi: 'firms.modaps.eosdis.nasa.gov/api/map_key/ पर जाकर MAP_KEY प्राप्त करें।', en: 'Register at firms.modaps.eosdis.nasa.gov/api/map_key/ to get a MAP_KEY.' },
  'fire.step2': { hi: '.env फ़ाइल बनाएँ और VITE_FIRMS_MAP_KEY= में कुंजी डालें।', en: 'Create a .env file and set VITE_FIRMS_MAP_KEY= to your key.' },
  'fire.step3': { hi: 'MAP_KEY क्लाइंट URL के लिए है — ब्राउज़र में सुरक्षित।', en: 'The MAP_KEY is a usage-tracking token meant for client request URLs — safe to expose in the browser.' },
  'fire.step4': { hi: 'डेव सर्वर रीस्टार्ट करें फिर पेज रिफ़्रेश करें।', en: 'Restart the dev server, then refresh this page.' },
  'fire.firmsFailedTitle': { hi: 'FIRMS अनुरोध विफल', en: 'FIRMS request failed' },
  'fire.firmsFailedNote': { hi: 'जहाँ उपलब्ध हो, EONET आग की घटनाएँ दिखाई जा रही हैं।', en: 'Showing EONET wildfire events where available.' },
  'fire.attrConfigured': { hi: 'NASA FIRMS (आग की पहचान) + NASA EONET (आग घटनाएँ)', en: 'NASA FIRMS (active fire detections) + NASA EONET (wildfire events)' },
  'fire.attrFallback': { hi: 'NASA EONET आग घटनाएँ (FIRMS सेट नहीं)', en: 'NASA EONET wildfire events (FIRMS not configured)' },
  'fire.empty.title': { hi: 'कोई आग की घटना उपलब्ध नहीं', en: 'No wildfire events available' },
  'fire.empty.desc': {
    hi: 'इस सत्र में FIRMS या EONET से कोई आग रिकॉर्ड नहीं मिली। रिफ़्रेश करें, या ‘बारे में’ पेज देखें।',
    en: 'Neither FIRMS nor EONET returned wildfire records in this session. Try refreshing, or check the live source pages linked in About.',
  },
  'fire.aboutData': { hi: 'इस डेटा के बारे में', en: 'About this data' },
  'fire.about1': { hi: 'FIRMS MODIS और VIIRS से निकट-वास्तविक-समय की आग की पहचान देता है — चमक, विश्वसनीयता, आग की क्षमता सहित।', en: 'FIRMS provides near-real-time active fire detections from MODIS and VIIRS, including brightness, confidence, and fire radiative power.' },
  'fire.about2': { hi: 'EONET आग एकाधिक स्रोतों से घटनाएँ जोड़ता है; निर्देशांक घटना दर्शाते हैं, हर पहचान नहीं।', en: 'EONET wildfires aggregates wildfire events from multiple sources; coordinates mark an event, not every individual detection.' },
  'fire.about3': { hi: 'विश्वसनीयता और FRP विवरण पैनल में दिखते हैं।', en: 'Detection confidence and FRP are shown in the event detail panel where supplied.' },
  'fire.about4': { hi: 'EONET आधिकारिक आपातकालीन-चेतावनी प्रणाली नहीं है।', en: 'EONET is not an official emergency-warning system and may lag real-time activity.' },

  // Natural events page
  'events.title': { hi: 'प्राकृतिक घटनाएँ', en: 'Natural Events' },
  'events.subtitle': {
    hi: 'NASA EONET — तूफान, ज्वालामुखी, बाढ़ आदि की निकट-वास्तविक-समय घटनाएँ',
    en: 'NASA EONET — near-real-time events across severe storms, volcanoes, floods, and more',
  },
  'events.status.open': { hi: 'खुली (सक्रिय)', en: 'Open (active)' },
  'events.status.closed': { hi: 'बंद (हाल की)', en: 'Closed (recent)' },
  'events.status.all': { hi: 'खुली + बंद', en: 'Open + closed' },
  'events.statusLabel': { hi: 'घटना स्थिति', en: 'Event status' },
  'events.note': {
    hi: 'EONET कई स्रोतों से घटनाएँ जोड़ता है। “खुली” घटना अभी सक्रिय मानी जाती है। कुछ घटनाओं में कई ज्यामिति होती है; नक्शा नवीनतम बिंदु दिखाता है। EONET आधिकारिक आपात-चेतावनी सेवा नहीं है।',
    en: 'EONET aggregates events from many sources. An “open” event is one EONET still considers active. Some events carry multiple geometries; the map plots the most recent point. EONET is not an official emergency-warning service.',
  },
  'events.attribution': { hi: 'NASA EONET v3 (eonet.gsfc.nasa.gov/api/v3)', en: 'NASA EONET v3 (eonet.gsfc.nasa.gov/api/v3)' },
  'events.footer': {
    hi: 'घटनाएँ © NASA EONET। प्रत्येक घटना के विवरण पैनल में स्रोत और लिंक सुरक्षित हैं। बिना निर्देशांक वाली घटनाएँ नक़्शे पर नहीं, केवल सूची में दिखती हैं।',
    en: 'Events © NASA EONET. Source identifiers and links are preserved in each event detail panel. Events without usable coordinates are omitted from the map but remain searchable in the table.',
  },

  // Satellite page
  'sat.title': { hi: 'उपग्रह व पृथ्वी अवलोकन', en: 'Satellite & Earth Observation' },
  'sat.subtitle': {
    hi: 'सार्वजनिक NASA तस्वीरें — रोज़ाना पृथ्वी अवलोकन (GIBS) और खगोल चित्र (APOD)',
    en: 'Public NASA imagery — daily Earth observation (GIBS) and the Astronomy Picture of the Day (APOD)',
  },
  'sat.apodTitle': { hi: 'दिन का खगोल चित्र (APOD)', en: 'Astronomy Picture of the Day (APOD)' },
  'sat.apodSubtitle': { hi: 'NASA — खगोल तस्वीरें, पृथ्वी अवलोकन से अलग', en: 'NASA — astronomy imagery, clearly distinct from Earth observation' },
  'sat.apodNote': {
    hi: 'ये खगोल तस्वीरें हैं (तारे, गैलेक्सी), पृथ्वी के उपग्रह चित्र नहीं। पृथ्वी तस्वीर के लिए नीचे GIBS एक्सप्लोरर देखें।',
    en: 'These are astronomy images (stars, galaxies, phenomena), not satellite photos of Earth. For Earth imagery, see the GIBS explorer below.',
  },
  'sat.apodShuffle': { hi: 'नई तस्वीरें', en: 'Shuffle' },
  'sat.apodVideo': { hi: 'वीडियो APOD — प्लेयर के लिए खोलें', en: 'Video APOD — open for player' },
  'sat.apodImgFail': { hi: 'तस्वीर उपलब्ध नहीं', en: 'Image unavailable' },
  'sat.apodNoItems': { hi: 'कोई APOD नहीं मिली', en: 'No APOD items returned' },
  'sat.apodNoItemsDesc': { hi: 'फिर से आज़माएँ।', en: 'Try shuffling again.' },
  'sat.apodLoadFail': { hi: 'APOD लोड नहीं हो सकी', en: 'Could not load APOD' },
  'sat.apodDemoNote': { hi: 'अभी DEMO_KEY उपयोग हो रहा है (सीमित दर)।', en: 'Currently using DEMO_KEY (rate-limited).' },
  'sat.gibsTitle': { hi: 'पृथ्वी तस्वीरें (NASA GIBS)', en: 'Earth imagery (NASA GIBS)' },
  'sat.gibsSubtitle': { hi: 'सार्वजनिक WMTS पृथ्वी तस्वीरें — कुंजी आवश्यक नहीं', en: 'Public WMTS satellite imagery of Earth — no API key required' },
  'sat.gibsLayer': { hi: 'तस्वीर परत', en: 'Imagery layer' },
  'sat.gibsDate': { hi: 'तस्वीर तारीख (UTC)', en: 'Imagery date (UTC)' },
  'sat.gibsInfo': { hi: 'दैनिक परतें कुछ घंटों में उपलब्ध होती हैं।', en: 'Daily layers typically become available within a few hours.' },
  'sat.gibsWorldview': { hi: 'NASA Worldview में खोलें', en: 'Open in NASA Worldview' },
  'sat.aboutResources': { hi: 'इन स्रोतों के बारे में', en: 'About these resources' },
  'sat.res1': { hi: 'NASA GIBS पूरे-ग्लोब की रोज़ाना MODIS व VIIRS तस्वीरें देता है — पूर्ण सार्वजनिक, कुंजी रहित। हम EPSG:3857 WMTS उपयोग करते हैं।', en: 'NASA GIBS provides full-globe, daily satellite imagery from MODIS and VIIRS. It is fully public and requires no API key. We use the EPSG:3857 WMTS endpoint.' },
  'sat.res2': { hi: 'NASA APOD खगोल तस्वीरें दिखाता है — यहाँ अलग से, पृथ्वी तस्वीर नहीं।', en: 'NASA APOD shows astronomy imagery — shown here separately and is intentionally not presented as satellite imagery of Earth.' },
  'sat.res3': { hi: 'APOD VITE_NASA_API_KEY का उपयोग करता है।', en: 'APOD uses the NASA API key configured as VITE_NASA_API_KEY.' },
  'sat.res4': { hi: 'तस्वीरें © NASA GIBS / NASA APOD।', en: 'Imagery © NASA GIBS / NASA APOD. Each image links back to its original source.' },
  'sat.demonoteFull': {
    hi: 'अभी साझा DEMO_KEY उपयोग हो रहा है, जो दर-सीमित है (~30 अनुरोध/घंटा)। अधिक सीमा के लिए api.nasa.gov पर मुफ़्त कुंजी लें।',
    en: ' Currently using the shared DEMO_KEY, which is rate-limited (≈30 requests/hour/IP). Get a free key at api.nasa.gov for higher limits.',
  },
  'sat.realKeyNote': { hi: 'एक वास्तविक API कुंजी सेट है।', en: ' A real API key is configured.' },

  // Analytics page
  'an.title': { hi: 'जानकारी', en: 'Analytics' },
  'an.subtitle': {
    hi: 'वर्तमान लोड किए रिकॉर्ड पर आधारित आँकड़े — सभी आँकड़े वास्तविक API प्रतिक्रिया से',
    en: 'Data-driven views over currently loaded records — all figures derive from real API responses',
  },
  'an.export': { hi: 'CSV निर्यात', en: 'Export CSV' },
  'an.exportedToast': { hi: 'रिकॉर्ड CSV में निर्यात हुए', en: 'Exported {n} records to CSV' },
  'an.noExport': { hi: 'निर्यात के लिए कोई रिकॉर्ड लोड नहीं', en: 'No records loaded to export' },
  'an.recordsLoaded': { hi: 'लोड किए रिकॉर्ड', en: 'Records loaded' },
  'an.withCoords': { hi: 'निर्देशांक सहित', en: 'With coordinates' },
  'an.withMag': { hi: 'तीव्रता सहित', en: 'With magnitude' },
  'an.categories': { hi: 'श्रेणियाँ', en: 'Categories' },
  'an.trendPeriod': { hi: 'प्रवृत्ति अवधि', en: 'Trend period' },
  'an.last7': { hi: 'पिछले 7 दिन', en: 'Last 7 days' },
  'an.last14': { hi: 'पिछले 14 दिन', en: 'Last 14 days' },
  'an.last30': { hi: 'पिछले 30 दिन', en: 'Last 30 days' },
  'an.trendNote': { hi: 'प्रवृत्तियाँ केवल लोड किए रिकॉर्ड दर्शाती हैं; फ़ीड सीमित इतिहास कवर करते हैं।', en: 'Trends reflect loaded records only; feeds cover limited history (e.g. USGS day feed ≈ 24h).' },
  'an.magBandsTitle': { hi: 'भूकंप तीव्रता बैंड', en: 'Earthquake magnitude bands' },
  'an.magBandsSub': { hi: 'प्रत्येक तीव्रता बैंड में USGS घटनाएँ', en: 'Count of USGS events in each magnitude band' },
  'an.noQuake': { hi: 'भूकंप डेटा नहीं', en: 'No earthquake data' },
  'an.noQuakeDesc': { hi: 'USGS डेटा लोड होने पर बैंड दिखेंगे।', en: 'Magnitude band counts appear once USGS data loads.' },
  'an.regionTitle': { hi: 'क्षेत्रीय सारांश', en: 'Regional summary' },
  'an.regionSub': { hi: 'लोड किए निर्देशांक से अनुमानित क्षेत्र बाल्टी', en: 'Approximate region buckets from loaded event coordinates' },
  'an.noGeo': { hi: 'कोई जियोकोडेड घटना नहीं', en: 'No geocoded events' },
  'an.noGeoDesc': { hi: 'निर्देशांक वाली घटनाएँ लोड होने पर क्षेत्रीय संख्या दिखेगी।', en: 'Regional counts appear once events with coordinates are loaded.' },
  'an.catBreakdown': { hi: 'श्रेणी बंटन', en: 'Category breakdown' },
  'an.noCats': { hi: 'कोई श्रेणी लोड नहीं।', en: 'No categories loaded.' },
  'an.exportFooter': {
    hi: 'CSV निर्यात में इस सत्र के सभी {n} लोड किए रिकॉर्ड शामिल हैं — id, स्रोत, श्रेणी, निर्देशांक, तीव्रता, गहराई, विश्वसनीयता, स्रोत URL। हम कभी ऐसा डेटा निर्यात नहीं करते जो इस सत्र में लाया न हो।',
    en: 'CSV export includes all {n} currently loaded records with their id, source, category, coordinates, magnitude, depth, confidence, and source URL. We never export data that was not fetched in this session.',
  },

  // Filters
  'filter.sortTime': { hi: 'क्रम: समय', en: 'Sort: Time' },
  'filter.sortMag': { hi: 'क्रम: तीव्रता', en: 'Sort: Magnitude' },
  'filter.mag0': { hi: 'तीव्रता ≥ 0', en: 'M ≥ 0' },
  'filter.mag2.5': { hi: 'तीव्रता ≥ 2.5', en: 'M ≥ 2.5' },
  'filter.mag4.5': { hi: 'तीव्रता ≥ 4.5', en: 'M ≥ 4.5' },
  'filter.mag5.5': { hi: 'तीव्रता ≥ 5.5', en: 'M ≥ 5.5' },
  'filter.mag6.5': { hi: 'तीव्रता ≥ 6.5', en: 'M ≥ 6.5' },

  // Help / onboarding
  'help.title': { hi: 'अर्थवॉच का उपयोग कैसे करें', en: 'How to use EarthWatch' },
  'help.intro': {
    hi: 'यह ऐप दुनिया भर की प्राकृतिक घटनाएँ दिखाता है। सब कुछ सरल शब्दों में है।',
    en: 'This app shows natural events from around the world. Everything is in simple words.',
  },
  'help.step1': { hi: 'बड़ा बटन “धरती पर क्या हो रहा है?” दबाएँ — ताज़ा जानकारी आती है।', en: 'Press the big “What is happening on Earth?” button — it brings the latest info.' },
  'help.step2': { hi: 'बाईं ओर के मेन्यू से कोई भी विषभ चुनें — भूकंप, आग, तूफान आदि।', en: 'Pick any subject from the menu on the left — earthquakes, fires, storms, and more.' },
  'help.step3': { hi: 'नक़्शे पर रंगीन बिंदु घटनाएँ हैं — बिंदु पर टैप कर जानकारी पढ़ें।', en: 'Colored dots on the map are events — tap a dot to read details.' },
  'help.step4': { hi: 'नीचे दी सूची में हर घटना है — खोज व फ़िल्टर से आसानी से ढूँढें।', en: 'The list below has every event — use search and filters to find easily.' },
  'help.step5': { hi: 'विवरण में “और जानकारी सुनें” बटन से आवाज़ सुन सकते हैं।', en: 'In details, the “Listen to details” button reads info aloud.' },
  'help.step6': { hi: 'ऊपर दाईं ओर भाषा बदल सकते हैं — हिंदी या अंग्रेज़ी।', en: 'Top right lets you switch language — Hindi or English.' },
  'help.gotIt': { hi: 'समझ आ गया', en: 'Got it' },
  'help.showAgain': { hi: 'मदद देखें', en: 'Show help' },

  // About page (key strings)
  'about.title': { hi: 'अर्थवॉच के बारे में', en: 'About EarthWatch' },
  'about.overview': { hi: 'अवलोकन', en: 'Overview' },
  'about.overviewText': {
    hi: 'अर्थवॉच एक खुला, संस्था-डेटा-आधारित वैश्विक निगरानी डैशबोर्ड है। यह सार्वजनिक भूकंप, आग, प्राकृतिक-घटना व उपग्रह डेटा को एक सुलभ इंटरफ़ेस में लाता है। हर संख्या वास्तविक API प्रतिक्रिया से है — कोई मनगढ़ंत डेटा नहीं।',
    en: 'EarthWatch is an open, agency-data-driven global monitoring dashboard. It brings together public earthquake, wildfire, natural-event, and satellite data into a single, accessible interface. Every number is computed from a real API response — no fabricated data.',
  },
  'about.disclaimer': {
    hi: 'अर्थवॉच आधिकारिक आपात-चेतावनी प्रणाली नहीं है और NASA या USGS से संबद्ध नहीं है। इसे खोज व परिस्थिति-ज्ञान के उपकरण के रूप में लें।',
    en: 'EarthWatch is not an official emergency-warning system and is not affiliated with NASA or USGS. Treat it as an exploration and situational-awareness tool.',
  },
  'about.features': { hi: 'विशेषताएँ', en: 'Features' },
  'about.sources': { hi: 'डेटा स्रोत व श्रेय', en: 'Data sources & attribution' },
  'about.limits': { hi: 'API सीमाएँ', en: 'API limitations' },
  'about.env': { hi: 'परिवेश कॉन्फ़िगरेशन', en: 'Environment configuration' },
  'about.known': { hi: 'ज्ञात सीमाएँ', en: 'Known limitations' },
  'about.opensource': { hi: 'ओपन सोर्स', en: 'Open source' },
  'about.back': { hi: 'डैशबोर्ड पर वापस', en: 'Back to dashboard' },
  'about.currentStatus': {
    hi: 'वर्तमान स्थिति — NASA API कुंजी: {k}; FIRMS MAP_KEY: {f}।',
    en: 'Current status — NASA API key: {k}; FIRMS MAP_KEY: {f}.',
  },
  'about.envNote': {
    hi: '.env.example को .env में कॉपी करें और केवल आवश्यक VITE_ मान सेट करें। रहस्य कभी VITE_ में न रखें।',
    en: 'Copy .env.example to .env and set only the VITE_ values you need. Never place true secrets behind a VITE_ variable.',
  },

  // Map page
  'worldmap.title': { hi: 'दुनिया का नक्शा', en: 'World Map' },
  'worldmap.subtitle': {
    hi: 'सभी लोड की गई घटनाएँ एक नक़्शे पर — देशों के नाम के साथ।',
    en: 'All loaded events on one map — with country labels.',
  },
  'worldmap.accessibleList': { hi: 'घटनाओं की सुलभ सूची', en: 'Accessible event list' },
} as const;

export type StringKey = keyof typeof STRINGS;

/** Interpolate {name} placeholders with values. */
export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
