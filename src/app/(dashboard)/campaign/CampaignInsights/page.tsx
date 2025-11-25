"use client"
import React, { useState } from 'react'
import CallByCampaignId from '@/components/campaign/CallByCampaignId'
import ChartWaveDashboard from '@/components/campaign/CampaignPerformanceChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import datas from '@/data/data.json'
import Container from '@/components/ui/container'
import PageTitle from '@/components/ui/pageTitle'
import { Phone, PhoneCall, PhoneMissed, PhoneOutgoing } from 'lucide-react'

function CampaignInsights() {
  const [activeTab, setActiveTab] = useState('table')

  const data = [
    { Title: "Total Call Triggered", value: '458', description: "Totals Calls Initiated Today", icon: <Phone /> },
    { Title: "Accepted Calls", value: '358', description: "Calls that the Customer revieved", icon: <PhoneCall /> },
    { Title: "Rejected Calls", value: '100', description: "Calls rejected By the customer", icon: <PhoneMissed /> },
    { Title: "Remaining calls", value: '300', description: "Total calls to be Triggered ", icon: <PhoneOutgoing /> }
  ]

  const tabs = [
      { id: 'table', label: 'Table' },
      { id: 'analytics', label: 'Analytics' }
  ]
  return (
    <Container>
      <PageTitle title='Campaign Insights'></PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data.map((item, index) => (
          <div key={index} className="w-full md:flex-1">
            <SummaryCard title={item.Title} value={item.value} description={item.description} icon={item.icon} />
          </div>
        ))}
      </div>
      {/* <ChartWaveDashboard />
      <CallByCampaignId callData={datas} /> */}
       {/* Tabs Navigation */}
            <div className="w-full mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-1 sm:space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-2 px-3 sm:px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="w-full">
                {activeTab === 'table' && (
                    <div className="animate-in fade-in-0 duration-200">
                        <CallByCampaignId callData={datas}/>
                    </div>
                )}
                
                {activeTab === 'analytics' && (
                    <div className="animate-in fade-in-0 duration-200">
                        <ChartWaveDashboard />
                    </div>
                )}
            </div>
    </Container>
  )
}

function SummaryCard({ title, value, description, icon, }: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;


}) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className="h-5 w-5 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default CampaignInsights
