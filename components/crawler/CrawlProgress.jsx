import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, AlertCircle, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function CrawlProgress({ crawls }) {
  const activeCrawls = crawls.filter(c => c.status === 'crawling' || c.status === 'pending');

  if (activeCrawls.length === 0) return null;

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Activity className="w-5 h-5" />
          Active Crawls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeCrawls.map((crawl) => {
            const progress = crawl.pages_found > 0 
              ? (crawl.pages_crawled / crawl.pages_found) * 100 
              : crawl.status === 'crawling' ? 5 : 0; // Show a little progress for crawling status

            return (
              <motion.div
                key={crawl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border-2 border-slate-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{crawl.website_url}</h4>
                    </div>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    {crawl.status === 'crawling' ? 'Crawling...' : 'Pending'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Progress</span>
                    <span>{crawl.pages_crawled || 0} / {crawl.pages_found || '?'} pages</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}