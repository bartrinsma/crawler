
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Globe, Search, Loader2, AlertCircle, CalendarClock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CrawlerForm({ onStartCrawl, isLoading }) {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    schedule: {
      type: 'none',
      day_of_month: 1,
    }
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Website name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onStartCrawl(formData);
    }
  };

  const handleUrlChange = (e) => {
    let url = e.target.value;
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setFormData({ ...formData, url });
    if (errors.url) setErrors({ ...errors, url: '' });
  };

  const handleScheduleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }));
  };

  const autoFillName = () => {
    if (formData.url && !formData.name) {
      try {
        const hostname = new URL(formData.url).hostname;
        const name = hostname.replace('www.', '').split('.')[0];
        setFormData({ 
          ...formData, 
          name: name.charAt(0).toUpperCase() + name.slice(1) 
        });
      } catch (_) {
        // Invalid URL, ignore
      }
    }
  };

  React.useEffect(() => {
    autoFillName();
  }, [formData.url]);

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; 
    switch (day % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Search className="w-5 h-5" />
          Start New Crawl
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-slate-700 font-medium">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={handleUrlChange}
              className={`${errors.url ? 'border-red-300 focus:border-red-500' : 'border-slate-300'} h-12`}
            />
            {errors.url && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.url}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-medium">Website Name</Label>
            <Input
              id="name"
              placeholder="My Website"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`${errors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-300'} h-12`}
            />
            {errors.name && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule" className="text-slate-700 font-medium">Crawl Schedule</Label>
            <div className="flex gap-2">
              <Select value={formData.schedule.type} onValueChange={(value) => handleScheduleChange('type', value)}>
                <SelectTrigger className="h-12 border-slate-300">
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Schedule</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              {formData.schedule.type === 'monthly' && (
                <Select value={formData.schedule.day_of_month.toString()} onValueChange={(value) => handleScheduleChange('day_of_month', parseInt(value))}>
                  <SelectTrigger className="h-12 border-slate-300 w-48">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}{getOrdinalSuffix(day)} of month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <Alert className="bg-slate-50 border-slate-200">
            <Globe className="h-4 w-4 text-slate-600" />
            <AlertDescription className="text-slate-600">
              The crawler will analyze your website for 404 errors, 301 redirects, and SEO issues like missing meta descriptions and page titles.
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Starting Crawl...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Start Crawling
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
