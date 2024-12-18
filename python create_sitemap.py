import os
from urllib.parse import urljoin
import xml.etree.ElementTree as ET
from xml.dom import minidom


def create_sitemap(base_url, output_file, root_dir):
    """Creates a sitemap.xml file by crawling all html files
       inside a root directory and subdirectories."""

    # 1. Create root element
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    # 2. Crawl through the root directory for html files
    for root, _, files in os.walk(root_dir):
      for file in files:
          if file.endswith(".html"):
              full_path = os.path.join(root, file)
              relative_path = os.path.relpath(full_path,root_dir)
              url = urljoin(base_url, relative_path.replace(os.sep,"/")) # Create URL for the file
              
              #3. Create a <url> element for each html file
              url_element = ET.SubElement(urlset, "url")
              loc_element = ET.SubElement(url_element, "loc")
              loc_element.text = url

    #4. Save the XML file
    xmlstr = minidom.parseString(ET.tostring(urlset)).toprettyxml(indent="  ")
    with open(output_file, "w", encoding="utf-8") as f:
         f.write(xmlstr)
    print(f"Created sitemap at '{output_file}'")


if __name__ == "__main__":
    base_url = "" # Base URL of your site
    output_file = "sitemap.xml"  # Output file name
    root_dir = "."      # Folder that contains all HTML files.

    create_sitemap(base_url, output_file, root_dir)
    print ("Finished creating sitemap file")