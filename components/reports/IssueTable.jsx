import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, AlertCircle, ArrowRight, Search } from "lucide-react";

const issueTypeColors = {
  '404': 'bg-red-50 text-red-700 border-red-200',
  '301': 'bg-amber-50 text-amber-700 border-amber-200',
  'missing_meta': 'bg-blue-50 text-blue-700 border-blue-200',
  'missing_title': 'bg-purple-50 text-purple-700 border-purple-200',
  'duplicate_title': 'bg-orange-50 text-orange-700 border-orange-200'
};

export default function IssueTable({ title, icon: Icon, data, type }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Icon className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Icon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No issues found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIssueColor = (issueType) => {
    if (type === '404') return issueTypeColors['404'];
    if (type === '301') return issueTypeColors['301'];
    return issueTypeColors[issueType] || issueTypeColors['missing_meta'];
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-900">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {title}
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {data.length}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                {type === '404' && (
                  <>
                    <TableHead>Broken URL</TableHead>
                    <TableHead>Source Page</TableHead>
                    <TableHead>Link Text</TableHead>
                    <TableHead>Actions</TableHead>
                  </>
                )}
                {type === '301' && (
                  <>
                    <TableHead>From URL</TableHead>
                    <TableHead>To URL</TableHead>
                    <TableHead>Source Page</TableHead>
                    <TableHead>Actions</TableHead>
                  </>
                )}
                {type === 'seo' && (
                  <>
                    <TableHead>Page URL</TableHead>
                    <TableHead>Issue Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 10).map((item, index) => (
                <TableRow key={index} className="hover:bg-slate-50">
                  {type === '404' && (
                    <>
                      <TableCell className="font-mono text-sm">{item.url}</TableCell>
                      <TableCell className="font-mono text-sm text-slate-600">{item.source_page}</TableCell>
                      <TableCell className="text-sm">{item.link_text}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                  {type === '301' && (
                    <>
                      <TableCell className="font-mono text-sm">{item.from_url}</TableCell>
                      <TableCell className="font-mono text-sm text-slate-600">{item.to_url}</TableCell>
                      <TableCell className="font-mono text-sm text-slate-500">{item.source_page}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                  {type === 'seo' && (
                    <>
                      <TableCell className="font-mono text-sm">{item.url}</TableCell>
                      <TableCell>
                        <Badge className={`${getIssueColor(item.issue_type)} border`}>
                          {item.issue_type.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{item.description}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {data.length > 10 && (
          <div className="mt-4 text-center">
            <Button variant="outline" className="border-slate-300 text-slate-600">
              View All {data.length} Issues
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}