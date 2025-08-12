import React, { useState, useEffect } from "react";
import { Website } from "@/entities/Website";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, Globe, Edit, Trash2, PlusCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function getDayWithOrdinal(day) {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
    }
}

function ScheduleModal({ website, onUpdate, children }) {
  const [schedule, setSchedule] = useState(website.schedule || { type: 'none', day_of_month: 1 });

  const handleUpdate = async () => {
    await Website.update(website.id, { schedule });
    onUpdate();
  };
  
  const handleScheduleChange = (field, value) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Schedule for {website.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-type">Frequency</Label>
            <Select id="schedule-type" value={schedule.type} onValueChange={(value) => handleScheduleChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Schedule</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {schedule.type === 'monthly' && (
            <div className="space-y-2">
              <Label htmlFor="schedule-day">Day of Month</Label>
              <Select id="schedule-day" value={schedule.day_of_month?.toString()} onValueChange={(value) => handleScheduleChange('day_of_month', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {getDayWithOrdinal(day)} of the month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Schedules() {
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const scheduledWebsites = websites.filter(w => w.schedule && w.schedule.type !== 'none');

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    setIsLoading(true);
    try {
      const data = await Website.list("-created_date");
      setWebsites(data);
    } catch (error) {
      console.error("Error loading websites:", error);
    }
    setIsLoading(false);
  };
  
  const handleRemoveSchedule = async (websiteId) => {
    await Website.update(websiteId, { schedule: { type: 'none' } });
    loadWebsites();
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Scheduled Crawls
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            Manage your automated website crawls to keep your reports up-to-date.
          </p>
        </motion.div>

        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5" />
                Active Schedules
              </div>
              <Link to={createPageUrl("Crawler")}>
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add New Schedule
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-slate-500">Loading schedules...</div>
            ) : scheduledWebsites.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No Scheduled Crawls Found</h3>
                <p className="text-slate-500 mb-4">
                  Set up a schedule to automatically crawl your websites.
                </p>
                <Link to={createPageUrl("Crawler")}>
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                    Create First Schedule
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledWebsites.map((website, index) => (
                  <motion.div
                    key={website.id}
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
                        <h4 className="font-semibold text-slate-900">{website.name}</h4>
                        <p className="text-sm text-slate-500">{website.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-sm">
                        Monthly on the {getDayWithOrdinal(website.schedule.day_of_month)}
                      </Badge>
                      <ScheduleModal website={website} onUpdate={loadWebsites}>
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-800">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </ScheduleModal>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600" onClick={() => handleRemoveSchedule(website.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}