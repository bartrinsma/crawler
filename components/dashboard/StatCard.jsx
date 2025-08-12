import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "slate", trend }) {
  const colorClasses = {
    slate: "bg-slate-50 border-slate-200 text-slate-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    red: "bg-red-50 border-red-200 text-red-700"
  };

  const iconColors = {
    slate: "text-slate-600 bg-slate-100",
    emerald: "text-emerald-600 bg-emerald-100",
    amber: "text-amber-600 bg-amber-100",
    red: "text-red-600 bg-red-100"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-6 ${colorClasses[color]} border-2 transition-all duration-200 hover:shadow-lg`}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm opacity-70">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconColors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 pt-4 border-t border-current border-opacity-20">
            <p className="text-sm opacity-70">{trend}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}