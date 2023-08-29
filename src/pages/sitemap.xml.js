//pages/sitemap.xml.js

const URLS = [
    "https://www.veplo.it/",
    "https://www.veplo.it/cerca/abbigliamento/uomo-tutto/tutto/rilevanza",
    "https://www.veplo.it/cerca/abbigliamento/donna-tutto/tutto/rilevanza",
    "https://www.veplo.it/profili/brand",
    "https://www.veplo.it/user/login?type=login&amp;person=user"
]

function generateSiteMap() {
    const currentDate = new Date();
    const isoString = currentDate.toISOString();

    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${URLS.map((url) => {
        return `
        <url>
            <loc>${url}</loc>
            <lastmod>${isoString}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.7</priority>
        </url>
     `
    }).join('')}
   </urlset>
 `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    // We make an API call to gather the URLs for our site

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap();

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;