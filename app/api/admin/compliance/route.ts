import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const [
      auditLogs,
      totalUsers,
      signedConsent,
      intakeForms,
      deletionRequests,
      mfaEnabledUsers,
      totalDocuments,
      privateDocuments,
      auditEventsLast7Days,
      activityEventsLast7Days,
    ] = await Promise.all([
      prisma.auditLog.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      }),
      prisma.user.count(),
      prisma.user.count({ where: { hasSignedConsent: true } }),
      prisma.intakeForm.count(),
      prisma.user.count({ where: { deletionRequestedAt: { not: null } } }),
      prisma.user.count({ where: { twoFactorEnabled: true } }),
      prisma.document.count(),
      prisma.document.count({ where: { isPrivate: true } }),
      prisma.auditLog.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.userActivity.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ])

    const consentRate = totalUsers > 0 ? (signedConsent / totalUsers) * 100 : 0
    const mfaAdoptionRate = totalUsers > 0 ? (mfaEnabledUsers / totalUsers) * 100 : 0
    const privateDocumentRate = totalDocuments > 0 ? (privateDocuments / totalDocuments) * 100 : 0
    const governanceEventsLast7Days = auditEventsLast7Days + activityEventsLast7Days

    const checklist = [
      {
        id: 'gov-1',
        task: 'Consent capture coverage',
        status: consentRate >= 90 ? 'COMPLIANT' : consentRate >= 70 ? 'PARTIAL' : 'ATTENTION',
        detail: `${signedConsent}/${totalUsers} users have signed clinical consent.`,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'gov-2',
        task: 'Protected document access',
        status:
          totalDocuments === 0
            ? 'IN_PROGRESS'
            : privateDocumentRate === 100
              ? 'COMPLIANT'
              : privateDocumentRate >= 80
                ? 'PARTIAL'
                : 'ATTENTION',
        detail:
          totalDocuments === 0
            ? 'No stored documents yet.'
            : `${privateDocuments}/${totalDocuments} uploaded documents are marked private.`,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'gov-3',
        task: 'Audit trail activity',
        status: governanceEventsLast7Days > 0 ? 'COMPLIANT' : 'ATTENTION',
        detail: `${governanceEventsLast7Days} audit and activity records captured in the last 7 days.`,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'gov-4',
        task: 'Deletion request backlog',
        status: deletionRequests === 0 ? 'COMPLIANT' : deletionRequests <= 5 ? 'PARTIAL' : 'ATTENTION',
        detail: `${deletionRequests} accounts are awaiting deletion follow-up.`,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'gov-5',
        task: 'Multi-factor adoption',
        status: mfaAdoptionRate >= 50 ? 'COMPLIANT' : mfaAdoptionRate > 0 ? 'PARTIAL' : 'ATTENTION',
        detail: `${mfaEnabledUsers}/${totalUsers} users have enabled MFA.`,
        lastChecked: new Date().toISOString(),
      },
    ]
    const governanceScore = Math.round(
      checklist.reduce((sum, item) => {
        switch (item.status) {
          case 'COMPLIANT':
            return sum + 100
          case 'PARTIAL':
            return sum + 65
          case 'IN_PROGRESS':
            return sum + 50
          default:
            return sum + 25
        }
      }, 0) / checklist.length
    )
    const attentionItems = checklist.filter((item) => item.status !== 'COMPLIANT').length

    return NextResponse.json({
      summary: {
        totalUsers,
        signedConsent,
        intakeForms,
        deletionRequests,
        consentRate: consentRate.toFixed(1),
        governanceScore,
        attentionItems,
        mfaAdoptionRate: mfaAdoptionRate.toFixed(1),
        privateDocumentRate: privateDocumentRate.toFixed(1),
        governanceEventsLast7Days,
      },
      auditLogs,
      checklist
    })
  } catch (error) {
    console.error('COMPLIANCE_FETCH_FAILED', error)
    return NextResponse.json({ error: 'Failed to fetch compliance data' }, { status: 500 })
  }
}
