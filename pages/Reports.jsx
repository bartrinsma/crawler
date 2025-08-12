
import React, { useState, useEffect } from "react";
import { Website, Crawl } from "@/entities/all";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowRight, Search, BarChart3, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import StatCard from "../components/dashboard/StatCard";
import IssueTable from "../components/reports/IssueTable";

export default function Reports() {
  const [websites, setWebsites] = useState([]);
  const [crawls, setCrawls] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [selectedCrawl, setSelectedCrawl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isLoading || crawls.length === 0 || websites.length === 0) {
      return; // Wait for data to load
    }

    const params = new URLSearchParams(location.search);
    const crawlId = params.get('crawl_id');

    if (crawlId) {
      const crawl = crawls.find(c => c.id === crawlId);
      if (crawl) {
        setSelectedCrawl(crawl);
        const website = websites.find(w => w.id === crawl.website_id);
        setSelectedWebsite(website);
      } else {
        // If crawlId in URL doesn't exist, remove it and default
        navigate(location.pathname, { replace: true });
        setDefaultCrawlSelection();
      }
    } else {
      setDefaultCrawlSelection();
    }
  }, [crawls, websites, location.search, isLoading]);

  const setDefaultCrawlSelection = () => {
    if (!selectedCrawl && crawls.length > 0) {
      // Find the latest completed crawl across all websites
      const latestCrawl = crawls.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];
      if (latestCrawl) {
        setSelectedCrawl(latestCrawl);
        const website = websites.find(w => w.id === latestCrawl.website_id);
        setSelectedWebsite(website);
        navigate(`?crawl_id=${latestCrawl.id}`, { replace: true });
      }
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [websiteData, crawlData] = await Promise.all([
        Website.list("-created_date"),
        Crawl.list("-created_date"), // Fetch all crawls, then filter later
      ]);
      const completedWebsites = websiteData.filter(w => w.status === 'completed');
      const completedCrawls = crawlData.filter(c => c.status === 'completed');
      
      setWebsites(completedWebsites);
      setCrawls(completedCrawls);
    } catch (error) {
      console.error("Error loading report data:", error);
    }
    setIsLoading(false);
  };
  
  const handleWebsiteChange = (websiteId) => {
    const website = websites.find(w => w.id === websiteId);
    setSelectedWebsite(website);
    
    // Find the latest crawl for the newly selected website
    const latestCrawlForWebsite = crawls
      .filter(c => c.website_id === websiteId)
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];

    setSelectedCrawl(latestCrawlForWebsite || null);
    if(latestCrawlForWebsite) {
      navigate(`?crawl_id=${latestCrawlForWebsite.id}`);
    } else {
      navigate(location.pathname); // Clear crawl_id if no crawls
    }
  };
  
  const handleCrawlChange = (crawlId) => {
    const crawl = crawls.find(c => c.id === crawlId);
    setSelectedCrawl(crawl);
    if(crawl) {
      navigate(`?crawl_id=${crawl.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (crawls.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BarChart3 className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">No Reports Available</h2>
          <p className="text-slate-600 max-w-md">
            There are no completed website crawls to generate reports. Please start a website crawl first.
          </p>
        </div>
      </div>
    );
  }

  const websiteCrawls = selectedWebsite 
    ? crawls.filter(c => c.website_id === selectedWebsite.id).sort((a, b) => new Date(b.created_date) - new Date(a.created_date)) 
    : [];
  
  const stats = {
    errors404: selectedCrawl?.errors_404?.length || 0,
    redirects301: selectedCrawl?.redirects_301?.length || 0,
    seoIssues: selectedCrawl?.seo_issues?.length || 0
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Website Reports
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            Detailed analysis of your website crawl results and optimization opportunities.
          </p>
        </motion.div>

        {/* Website and Crawl Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border-2 border-slate-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label htmlFor="website-select" className="text-sm font-medium text-slate-700 mb-2 block">Select Website</label>
              <Select 
                value={selectedWebsite?.id || ""} 
                onValueChange={handleWebsiteChange}
                disabled={websites.length === 0}
              >
                <SelectTrigger id="website-select" className="w-full">
                  <SelectValue placeholder="Choose a website" />
                </SelectTrigger>
                <SelectContent>
                  {websites.map((website) => (
                    <SelectItem key={website.id} value={website.id}>
                      {website.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div>
              <label htmlFor="crawl-select" className="text-sm font-medium text-slate-700 mb-2 block">Select Crawl Date</label>
              <Select 
                value={selectedCrawl?.id || ""} 
                onValueChange={handleCrawlChange} 
                disabled={!selectedWebsite || websiteCrawls.length === 0}
              >
                <SelectTrigger id="crawl-select" className="w-full">
                  <SelectValue placeholder="Choose a crawl" />
                </SelectTrigger>
                <SelectContent>
                  {websiteCrawls.map((crawl) => (
                    <SelectItem key={crawl.id} value={crawl.id}>
                      {format(new Date(crawl.created_date), "MMMM d, yyyy 'at' h:mm a")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {selectedCrawl ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="404 Errors"
                value={stats.errors404}
                subtitle="Broken links found"
                icon={AlertCircle}
                color="red"
              />
              <StatCard
                title="301 Redirects"
                value={stats.redirects301}
                subtitle="Redirects detected"
                icon={ArrowRight}
                color="amber"
              />
              <StatCard
                title="SEO Issues"
                value={stats.seoIssues}
                subtitle="Optimization opportunities"
                icon={Search}
                color="emerald"
              />
            </div>

            {/* Issue Tables */}
            <div className="space-y-8">
              <IssueTable
                title="404 Errors"
                icon={AlertCircle}
                data={selectedCrawl.errors_404}
                type="404"
              />
              
              <IssueTable
                title="301 Redirects"
                icon={ArrowRight}
                data={selectedCrawl.redirects_301}
                type="301"
              />
              
              <IssueTable
                title="SEO Issues"
                icon={Search}
                data={selectedCrawl.seo_issues}
                type="seo"
              />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 text-center text-slate-500">
            <Calendar className="w-10 h-10 mx-auto mb-4" />
            <p className="font-semibold text-lg">No crawls available for the selected website.</p>
            <p>Please select another website or perform a crawl.</p>
          </div>
        )}
      </div>
    </div>
  );
}
