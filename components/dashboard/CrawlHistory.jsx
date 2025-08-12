import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, AlertCircle, CheckCircle, Clock, XCircle, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const statusConfig = {
  pending: { 
    color: "bg-amber-50 text-amber-700 border-amber-200", 
    icon: Clock, 
    label: "Pending" 
  },
  crawling: { 
    color: "bg-blue-50 text-blue-700 border-blue-200", 
    icon: Clock, 
    label: "Crawling" 
  },
  completed: { 
    color: "bg-emerald-50 text-emerald-700 border-emerald-200", 
    icon: CheckCircle, 
    label: "Completed" 
  },
  failed: { 
    color: "bg-red-50 text-red-700 border-red-200", 
    icon: XCircle, 
    label: "Failed" 
  }
};

export default function CrawlHistory({ crawls, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Globe className="w-5 h-5" />
            Crawl History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-900">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Crawl History
          </div>
          <Link to={createPageUrl("Crawler")}>
            <Button variant="outline" size="sm" className="text-slate-600 border-slate-300">
              New Crawl
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {crawls.slice(0, 5).map((crawl, index) => {
            const status = statusConfig[crawl.status];
            const StatusIcon = status.icon;
            
            return (
              <motion.div
                key={crawl.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-slate-200 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{crawl.website?.name || 'Unknown Website'}</h4>
                    <p className="text-sm text-slate-500">{crawl.website_url}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {format(new Date(crawl.created_date), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${status.color} border`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                  <Link to={createPageUrl(`Reports?crawl_id=${crawl.id}`)}>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
          {crawls.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 mb-2">No crawls yet</p>
              <Link to={createPageUrl("Crawler")}>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                  Start Your First Crawl
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}