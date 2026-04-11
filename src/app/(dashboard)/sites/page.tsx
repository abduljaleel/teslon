import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sites } from "@/lib/data/energy";
import { Plus } from "lucide-react";

export default function SitesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">
            Manage and monitor your energy sites
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Add Site
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Grid Region</TableHead>
                <TableHead className="text-right">Consumption (24h)</TableHead>
                <TableHead className="text-right">Cost (24h)</TableHead>
                <TableHead className="text-right">Carbon (24h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>
                    <Link
                      href={`/sites/${site.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {site.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {site.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {site.gridRegion}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {site.consumption24h.toLocaleString()} kWh
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${site.cost24h.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {site.carbon24h.toLocaleString()} kg
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
