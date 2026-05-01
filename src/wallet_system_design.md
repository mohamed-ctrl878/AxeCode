import os

# The content provided by the user
content = """const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Footer, Header, TabStopType, TabStopPosition,
  PageBreak, UnderlineType
} = require('docx');
const fs = require('fs');

const PURPLE = "5B21B6";
const PURPLE_LIGHT = "EDE9FE";
const RED = "991B1B";
const RED_LIGHT = "FEE2E2";
const AMBER = "92400E";
const AMBER_LIGHT = "FEF3C7";
const TEAL = "0F766E";
const TEAL_LIGHT = "CCFBF1";
const GRAY_LIGHT = "F8F7F5";
const GRAY_MID = "E5E3DC";
const GRAY_DARK = "374151";
const WHITE = "FFFFFF";
const BLACK = "111827";

const border = { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: PURPLE })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PURPLE_LIGHT, space: 4 } },
    children: [new TextRun({ text, font: "Arial", size: 26, bold: true, color: GRAY_DARK })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 22, bold: true, color: TEAL })]
  });
}

function h4(text) {
  return new Paragraph({
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 20, bold: true, color: GRAY_DARK })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: opts.color || BLACK, bold: opts.bold || false })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: BLACK })]
  });
}

function code(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    shading: { fill: "1E293B", type: ShadingType.CLEAR },
    children: [new TextRun({ text, font: "Courier New", size: 18, color: "E2E8F0" })]
  });
}

function codeBlock(lines) {
  return [
    new Paragraph({
      spacing: { before: 120, after: 0 },
      shading: { fill: "1E293B", type: ShadingType.CLEAR },
      children: [new TextRun({ text: "", font: "Courier New", size: 18 })]
    }),
    ...lines.map((line, i) => new Paragraph({
      spacing: { before: 0, after: i === lines.length - 1 ? 0 : 0 },
      shading: { fill: "1E293B", type: ShadingType.CLEAR },
      children: [new TextRun({ text: line, font: "Courier New", size: 18, color: "E2E8F0" })]
    })),
    new Paragraph({
      spacing: { before: 0, after: 120 },
      shading: { fill: "1E293B", type: ShadingType.CLEAR },
      children: [new TextRun({ text: "", font: "Courier New", size: 18 })]
    })
  ];
}

function note(text, type = "info") {
  const colors = {
    info: { bg: "EDE9FE", border_color: PURPLE, icon: "ℹ" },
    warning: { bg: "FEF3C7", border_color: "D97706", icon: "⚠" },
    danger: { bg: "FEE2E2", border_color: "DC2626", icon: "✕" },
    success: { bg: "D1FAE5", border_color: "059669", icon: "✓" },
  };
  const c = colors[type];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: {
          top: noBorder, bottom: noBorder, right: noBorder,
          left: { style: BorderStyle.SINGLE, size: 12, color: c.border_color }
        },
        shading: { fill: c.bg, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 200, right: 120 },
        width: { size: 9360, type: WidthType.DXA },
        children: [new Paragraph({
          children: [new TextRun({ text, font: "Arial", size: 18, color: GRAY_DARK })]
        })]
      })]
    })]
  });
}

function spacer(size = 120) {
  return new Paragraph({ spacing: { before: 0, after: size }, children: [new TextRun("")] });
}

function headerTable(title, subtitle, version) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [6500, 2860],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            shading: { fill: PURPLE, type: ShadingType.CLEAR },
            borders: noBorders,
            margins: { top: 200, bottom: 100, left: 240, right: 240 },
            width: { size: 9360, type: WidthType.DXA },
            children: [new Paragraph({
              children: [new TextRun({ text: title, font: "Arial", size: 40, bold: true, color: WHITE })]
            })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: "4C1D95", type: ShadingType.CLEAR },
            borders: noBorders,
            margins: { top: 100, bottom: 200, left: 240, right: 120 },
            width: { size: 6500, type: WidthType.DXA },
            children: [new Paragraph({
              children: [new TextRun({ text: subtitle, font: "Arial", size: 22, color: "C4B5FD" })]
            })]
          }),
          new TableCell({
            shading: { fill: "4C1D95", type: ShadingType.CLEAR },
            borders: noBorders,
            margins: { top: 100, bottom: 200, left: 120, right: 240 },
            width: { size: 2860, type: WidthType.DXA },
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: version, font: "Arial", size: 20, color: "A78BFA" })]
            })]
          })
        ]
      })
    ]
  });
}

function simpleTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      shading: { fill: PURPLE, type: ShadingType.CLEAR },
      borders,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      width: { size: colWidths[i], type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text: h, font: "Arial", size: 18, bold: true, color: WHITE })]
      })]
    }))
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      shading: { fill: ri % 2 === 0 ? WHITE : GRAY_LIGHT, type: ShadingType.CLEAR },
      borders,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      width: { size: colWidths[ci], type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text: cell, font: "Arial", size: 18, color: BLACK })]
      })]
    }))
  }));

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows]
  });
}

function tagBadge(text, color, bg) {
  return new TextRun({ text: ` ${text} `, font: "Arial", size: 17, color, bold: true, highlight: "none" });
}

// ─── DOCUMENT CONTENT ───────────────────────────────────────────────────────

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 240 } } }
        }, {
          level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 880, hanging: 240 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 240 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [6000, 3360],
          rows: [new TableRow({
            children: [
              new TableCell({
                borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: GRAY_MID } },
                margins: { top: 60, bottom: 60, left: 0, right: 0 },
                width: { size: 6000, type: WidthType.DXA },
                children: [new Paragraph({
                  children: [new TextRun({ text: "Wallet & Payment System Design", font: "Arial", size: 17, color: "9CA3AF" })]
                })]
              }),
              new TableCell({
                borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: GRAY_MID } },
                margins: { top: 60, bottom: 60, left: 0, right: 0 },
                width: { size: 3360, type: WidthType.DXA },
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: "Strapi CMS — Modular Monolith", font: "Arial", size: 17, color: "9CA3AF" })]
                })]
              })
            ]
          })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [6000, 3360],
          rows: [new TableRow({
            children: [
              new TableCell({
                borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 4, color: GRAY_MID } },
                margins: { top: 60, bottom: 0, left: 0, right: 0 },
                width: { size: 6000, type: WidthType.DXA },
                children: [new Paragraph({
                  children: [new TextRun({ text: "محفوظ للفريق الهندسي — وثيقة داخلية", font: "Arial", size: 17, color: "9CA3AF" })]
                })]
              }),
              new TableCell({
                borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 4, color: GRAY_MID } },
                margins: { top: 60, bottom: 0, left: 0, right: 0 },
                width: { size: 3360, type: WidthType.DXA },
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: "Page ", font: "Arial", size: 17, color: "9CA3AF" }),
                    new PageNumber({ font: "Arial", size: 17, color: "9CA3AF" })
                  ]
                })]
              })
            ]
          })]
        })]
      })
    },
    children: [

      // ── COVER ─────────────────────────────────────────────────────────────
      headerTable(
        "Wallet & Payment System Design",
        "نظام المحافظ والمدفوعات — Strapi CMS Customized Feature",
        "v2.0 — 2025"
      ),
      spacer(320),

      // Meta table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 7160],
        rows: [
          ["النمط المعماري", "Modular Monolith داخل Strapi CMS"],
          ["بوابة الدفع", "Paymob (Webhooks + Disbursements API)"],
          ["قاعدة البيانات", "PostgreSQL مع Optimistic + Pessimistic Locking"],
          ["Background Jobs", "Strapi Cron + Custom Queue (Outbox Pattern)"],
          ["الإطار", "Strapi v4/v5 — TypeScript"],
          ["الحالة", "System Design — للمراجعة والتنفيذ"],
        ].map(([k, v], i) => new TableRow({
          children: [
            new TableCell({
              shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR },
              borders,
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              width: { size: 2200, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun({ text: k, font: "Arial", size: 18, bold: true, color: GRAY_DARK })] })]
            }),
            new TableCell({
              shading: { fill: i % 2 === 0 ? GRAY_LIGHT : WHITE, type: ShadingType.CLEAR },
              borders,
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              width: { size: 7160, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun({ text: v, font: "Arial", size: 18, color: BLACK })] })]
            })
          ]
        }))
      }),

      spacer(200),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 1. ARCHITECTURE ────────────────────────────────────────────────────
      h1("1. البنية المعمارية (Architecture Overview)"),
      p("نعتمد نمط Modular Monolith داخل Strapi، حيث كل وحدة وظيفية (Module) مستقلة منطقياً لكنها تشارك نفس Process وقاعدة البيانات. هذا يتيح سهولة الاستبدال مستقبلاً لأي وحدة بـ Microservice مستقل دون إعادة كتابة كاملة."),
      spacer(80),

      h3("المبادئ الأساسية"),
      bullet("Immutable Ledger: كل حركة مالية تُسجَّل ولا تُعدَّل — Append Only"),
      bullet("Idempotency First: كل عملية دفع تُعالَج مرة واحدة فقط مهما تكررت"),
      bullet("Fail Safe: الفشل لا يُنتج حالة غير متسقة (Atomic Transactions)"),
      bullet("Defense in Depth: أمان متعدد الطبقات (HMAC + Auth + Rate Limit)"),
      bullet("Observable: كل حدث مهم يُسجَّل ويُراقَب"),
      spacer(160),

      h3("الوحدات الوظيفية"),
      simpleTable(
        ["الوحدة", "المسؤولية", "التبعيات"],
        [
          ["Event Module", "بيانات الفعاليات، إصدار التذاكر، QR Codes", "Wallet Module (via Events)"],
          ["Payment Module", "استقبال Webhooks، التحقق HMAC، Idempotency", "Wallet Module, Event Module"],
          ["Wallet Module", "الأرصدة، Ledger، العمولات، Payouts", "لا تبعيات خارجية"],
          ["Notification Module", "إيميل، QR، إشعارات", "Outbox Pattern فقط"],
          ["Auth Module", "JWT، RBAC، Publisher Isolation", "كل الوحدات"],
          ["Audit Module", "سجل التعديلات من غيَّر ماذا متى", "كل الوحدات"],
        ],
        [2200, 4200, 2960]
      ),
      spacer(200),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 2. FILE STRUCTURE ─────────────────────────────────────────────────
      h1("2. هيكل الملفات (File Structure — Strapi Compatible)"),
      p("البنية موافقة لـ Strapi v4/v5 مع استخدام src/extensions و src/api لكل module بشكل مستقل."),
      spacer(80),

      ...codeBlock([
        "src/",
        "├── api/                          # Strapi Content Types (Auto-generated + Extended)",
        "│   ├── event/                    # فعاليات",
        "│   │   ├── content-types/",
        "│   │   │   └── event/schema.json",
        "│   │   ├── controllers/",
        "│   │   │   └── event.ts",
        "│   │   ├── routes/",
        "│   │   │   └── event.ts",
        "│   │   └── services/",
        "│   │       └── event.ts",
        "│   │",
        "│   ├── ticket/                   # تذاكر",
        "│   │   ├── content-types/ticket/schema.json",
        "│   │   ├── controllers/ticket.ts",
        "│   │   ├── routes/ticket.ts",
        "│   │   └── services/ticket.ts",
        "│   │",
        "│   ├── wallet/                   # محافظ",
        "│   │   ├── content-types/wallet/schema.json",
        "│   │   ├── controllers/wallet.ts",
        "│   │   ├── routes/wallet.ts",
        "│   │   └── services/",
        "│   │       ├── wallet.ts         # الرصيد والعمليات الأساسية",
        "│   │       └── wallet-payout.ts  # منطق السحب",
        "│   │",
        "│   ├── transaction/              # سجل الحركات (Ledger)",
        "│   │   ├── content-types/transaction/schema.json",
        "│   │   ├── controllers/transaction.ts",
        "│   │   └── services/transaction.ts",
        "│   │",
        "│   └── payment/                  # وسيط Paymob",
        "│       ├── content-types/",
        "│       │   ├── idempotency-key/schema.json",
        "│       │   └── outbox-message/schema.json",
        "│       ├── controllers/",
        "│       │   └── webhook.ts        # POST /api/payment/webhook",
        "│       ├── routes/",
        "│       │   └── webhook.ts",
        "│       └── services/",
        "│           ├── payment.ts        # منطق المعالجة الرئيسي",
        "│           ├── hmac.ts           # التحقق من Paymob Signature",
        "│           └── idempotency.ts    # فحص التكرار",
        "│",
        "├── extensions/                   # تخصيص Strapi Core",
        "│   ├── users-permissions/        # تمديد Auth",
        "│   │   └── strapi-server.ts      # إضافة Publisher Role",
        "│   └── content-manager/",
        "│       └── strapi-server.ts",
        "│",
        "└── plugins/",
        "    └── wallet-dashboard/         # لوحة تحكم Reconciliation",
        "        ├── admin/src/            # React UI للمديرين",
        "        │   ├── pages/",
        "        │   │   ├── Reconciliation.tsx",
        "        │   │   └── WalletOverview.tsx",
        "        │   └── index.ts",
        "        └── server/",
        "            ├── controllers/",
        "            │   └── reconciliation.ts",
        "            ├── routes/",
        "            │   └── index.ts",
        "            └── services/",
        "                └── reconciliation.ts",
        "",
        "config/",
        "├── middlewares.ts                # Rate Limiting + IP Allowlist",
        "├── cron-tasks.ts                 # Outbox Worker + Reconciliation Cron",
        "└── plugins.ts",
        "",
        "database/",
        "├── migrations/                   # Schema migrations",
        "│   ├── 001_create_wallets.ts",
        "│   ├── 002_create_transactions.ts",
        "│   ├── 003_create_idempotency_keys.ts",
        "│   ├── 004_create_outbox_messages.ts",
        "│   └── 005_create_audit_logs.ts",
        "└── seeds/",
        "    └── admin-wallet.ts",
        "",
        "tests/",
        "├── unit/",
        "│   ├── hmac.test.ts",
        "│   ├── idempotency.test.ts",
        "│   └── wallet-balance.test.ts",
        "├── integration/",
        "│   ├── webhook-flow.test.ts",
        "│   ├── concurrent-payments.test.ts",
        "│   └── reconciliation.test.ts",
        "└── e2e/",
        "    ├── full-payment-journey.test.ts",
        "    └── refund-flow.test.ts",
      ]),

      spacer(160),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 3. DATA SCHEMA ────────────────────────────────────────────────────
      h1("3. تصميم قاعدة البيانات (Data Schema)"),
      p("نعتمد مبدأ Immutable Ledger — كل حركة مالية تُضاف ولا تُعدَّل أبداً. الرصيد الحالي هو مجموع كل Transactions."),
      spacer(80),

      h2("3.1 جدول Wallets"),
      simpleTable(
        ["الحقل", "النوع", "القيد", "الوصف"],
        [
          ["id", "UUID", "PK", "معرف فريد"],
          ["owner_id", "UUID", "FK → users", "مالك المحفظة (Publisher أو Admin)"],
          ["owner_type", "ENUM", "publisher | platform", "نوع المالك"],
          ["balance", "DECIMAL(15,2)", "NOT NULL DEFAULT 0", "الرصيد الحالي"],
          ["pending_balance", "DECIMAL(15,2)", "NOT NULL DEFAULT 0", "رصيد معلق حتى انتهاء الحدث"],
          ["version", "INTEGER", "NOT NULL DEFAULT 0", "للـ Optimistic Locking"],
          ["currency", "VARCHAR(3)", "DEFAULT 'EGP'", "العملة"],
          ["is_active", "BOOLEAN", "DEFAULT true", "تعطيل المحفظة"],
          ["created_at", "TIMESTAMP", "NOT NULL", ""],
          ["updated_at", "TIMESTAMP", "NOT NULL", ""],
        ],
        [2000, 1800, 2200, 3360]
      ),
      spacer(160),

      h2("3.2 جدول Transactions (الـ Ledger)"),
      simpleTable(
        ["الحقل", "النوع", "الوصف"],
        [
          ["id", "UUID PK", "معرف الحركة"],
          ["wallet_id", "UUID FK", "المحفظة المعنية"],
          ["amount", "DECIMAL(15,2)", "المبلغ — دائماً موجب"],
          ["type", "ENUM", "CREDIT (إيداع) | DEBIT (خصم)"],
          ["status", "ENUM", "PENDING | COMPLETED | FAILED | REVERSED"],
          ["reference_type", "ENUM", "TICKET_PAYMENT | REFUND | PAYOUT | COMMISSION | ADJUSTMENT"],
          ["reference_id", "UUID", "ID الكيان المرجعي (Ticket, Refund...)"],
          ["payment_id", "VARCHAR", "Paymob Transaction ID"],
          ["metadata", "JSONB", "بيانات إضافية (event_id, ticket_count...)"],
          ["created_at", "TIMESTAMP", "وقت تسجيل الحركة — لا يُعدَّل أبداً"],
        ],
        [2000, 2000, 5360]
      ),
      spacer(160),

      h2("3.3 جدول IdempotencyKeys"),
      simpleTable(
        ["الحقل", "النوع", "الوصف"],
        [
          ["key", "VARCHAR(255) PK", "Paymob Transaction ID — المفتاح الفريد"],
          ["status", "ENUM", "PROCESSING | COMPLETED | FAILED"],
          ["result_payload", "JSONB", "نتيجة المعالجة للرد السريع"],
          ["processed_at", "TIMESTAMP", "وقت الانتهاء"],
          ["expires_at", "TIMESTAMP", "وقت انتهاء الصلاحية (7 أيام)"],
        ],
        [2800, 2000, 4560]
      ),
      spacer(160),

      h2("3.4 جدول OutboxMessages"),
      simpleTable(
        ["الحقل", "النوع", "الوصف"],
        [
          ["id", "UUID PK", ""],
          ["event_type", "VARCHAR", "TICKET_ISSUED | QR_SEND | EMAIL_CONFIRM | PAYOUT_NOTIFY"],
          ["payload", "JSONB", "البيانات المطلوبة للتنفيذ"],
          ["status", "ENUM", "PENDING | PROCESSING | DONE | DEAD"],
          ["attempts", "INTEGER", "عدد محاولات التنفيذ"],
          ["max_attempts", "INTEGER", "DEFAULT 5 — الحد الأقصى"],
          ["last_error", "TEXT", "آخر خطأ — للتشخيص"],
          ["scheduled_at", "TIMESTAMP", "موعد التنفيذ (للتأجيل)"],
          ["processed_at", "TIMESTAMP", "وقت النجاح"],
        ],
        [2200, 2000, 5160]
      ),
      spacer(160),

      h2("3.5 جدول AuditLogs"),
      simpleTable(
        ["الحقل", "النوع", "الوصف"],
        [
          ["id", "UUID PK", ""],
          ["actor_id", "UUID", "من قام بالعملية"],
          ["actor_type", "ENUM", "SYSTEM | ADMIN | PUBLISHER"],
          ["action", "VARCHAR", "WALLET_CREDIT | WALLET_DEBIT | MANUAL_ADJUSTMENT..."],
          ["entity_type", "VARCHAR", "wallet | transaction | ticket"],
          ["entity_id", "UUID", "ID الكيان المتأثر"],
          ["before_state", "JSONB", "الحالة قبل التغيير"],
          ["after_state", "JSONB", "الحالة بعد التغيير"],
          ["ip_address", "VARCHAR", "IP العميل"],
          ["created_at", "TIMESTAMP", ""],
        ],
        [2200, 2000, 5160]
      ),
      spacer(200),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 4. SECURITY ────────────────────────────────────────────────────────
      h1("4. طبقة الأمان (Security Layer)"),
      spacer(80),

      h2("4.1 Authentication & Authorization"),
      p("نستخدم Strapi Users-Permissions مع تمديده لإضافة Publisher Role وقواعد Ownership صارمة."),
      spacer(80),
      simpleTable(
        ["الـ Role", "الصلاحيات"],
        [
          ["Admin (Platform)", "رؤية كل المحافظ — تعديل يدوي — Reconciliation — Payouts"],
          ["Publisher", "رؤية محفظته فقط — طلب سحب — رؤية تذاكر أحداثه فقط"],
          ["System (Webhook)", "Endpoint مخصص بدون JWT — محمي بـ HMAC + IP Allowlist"],
          ["Public", "شراء تذاكر — لا وصول لأي بيانات مالية"],
        ],
        [2400, 6960]
      ),
      spacer(160),

      h2("4.2 Webhook Security — متعدد الطبقات"),
      bullet("IP Allowlist: رفض أي طلب ليس من عناوين Paymob المعروفة"),
      bullet("HMAC-SHA512 Verification: التحقق من Signature في كل طلب"),
      bullet("Rate Limiting: 100 request/minute على الـ Webhook Endpoint"),
      bullet("Replay Protection: رفض Webhook أقدم من 5 دقائق (timestamp check)"),
      bullet("TLS Only: رفض الاتصالات غير المشفرة"),
      spacer(120),

      ...codeBlock([
        "// src/api/payment/services/hmac.ts",
        "import crypto from 'crypto';",
        "",
        "export function verifyPaymobHMAC(",
        "  payload: Record<string, unknown>,",
        "  receivedHmac: string,",
        "  secret: string",
        "): boolean {",
        "  // 1. استخراج الحقول المطلوبة بالترتيب الذي يحدده Paymob",
        "  const concatenated = [",
        "    payload.amount_cents,",
        "    payload.created_at,",
        "    payload.currency,",
        "    payload.error_occured,",
        "    payload.has_parent_transaction,",
        "    payload.id,",
        "    payload.integration_id,",
        "    payload.is_3d_secure,",
        "    payload.is_auth,",
        "    payload.is_capture,",
        "    payload.is_refunded,",
        "    payload.is_standalone_payment,",
        "    payload.is_voided,",
        "    payload.order_id,",
        "    payload.owner,",
        "    payload.pending,",
        "    payload['source_data.pan'],",
        "    payload['source_data.sub_type'],",
        "    payload['source_data.type'],",
        "    payload.success,",
        "  ].join('');",
        "",
        "  const expected = crypto",
        "    .createHmac('sha512', secret)",
        "    .update(concatenated)",
        "    .digest('hex');",
        "",
        "  // Timing-safe comparison — يمنع Timing Attacks",
        "  return crypto.timingSafeEqual(",
        "    Buffer.from(expected),",
        "    Buffer.from(receivedHmac)",
        "  );",
        "}",
      ]),

      spacer(160),
      h2("4.3 Concurrency Control — الـ Locking Strategy"),
      p("نستخدم Optimistic Locking كأساس مع Pessimistic Locking في حالات التعارض العالي."),
      spacer(80),

      ...codeBlock([
        "// src/api/wallet/services/wallet.ts",
        "// Optimistic Locking — الحالة العادية",
        "async function creditWallet(walletId: string, amount: number, trx: Knex.Transaction) {",
        "  const wallet = await trx('wallets').where({ id: walletId }).first();",
        "",
        "  const updated = await trx('wallets')",
        "    .where({ id: walletId, version: wallet.version }) // <-- شرط الـ Version",
        "    .increment('balance', amount)",
        "    .increment('version', 1);",
        "",
        "  if (updated === 0) {",
        "    // تعارض — محاولة أخرى بـ Exponential Backoff",
        "    throw new OptimisticLockError('Wallet was modified concurrently');",
        "  }",
        "}",
        "",
        "// Pessimistic Locking — للـ High Contention (Payout)",
        "async function debitWalletSafe(walletId: string, amount: number, trx: Knex.Transaction) {",
        "  const wallet = await trx('wallets')",
        "    .where({ id: walletId })",
        "    .forUpdate()  // SELECT FOR UPDATE — يقفل الصف",
        "    .first();",
        "",
        "  if (wallet.balance < amount) {",
        "    throw new InsufficientFundsError();",
        "  }",
        "",
        "  await trx('wallets')",
        "    .where({ id: walletId })",
        "    .decrement('balance', amount)",
        "    .increment('version', 1);",
        "}",
      ]),

      spacer(200),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 5. PAYMENT FLOW ────────────────────────────────────────────────────
      h1("5. تدفق المدفوعات (Payment Flow)"),
      spacer(80),

      h2("5.1 Happy Path — العملية الناجحة"),
      spacer(80),

      simpleTable(
        ["الخطوة", "المكون", "الإجراء", "في حالة الفشل"],
        [
          ["1", "Middleware", "IP Allowlist Check — رفض ما ليس من Paymob", "403 Forbidden"],
          ["2", "Middleware", "Rate Limit Check — 100 req/min", "429 Too Many Requests"],
          ["3", "WebhookController", "استقبال الطلب + Parse Body", "400 Bad Request"],
          ["4", "HmacService", "التحقق من HMAC Signature", "401 Unauthorized"],
          ["5", "HmacService", "التحقق من Timestamp — أقل من 5 دقائق", "401 Replay Attack"],
          ["6", "IdempotencyService", "فحص هل payment_id موجود مسبقاً", "200 OK (الرد المحفوظ)"],
          ["7", "DB Transaction", "بداية Unit of Work الذري", "Rollback تلقائي"],
          ["8", "WalletService", "CREDIT محفظة الناشر (السعر - العمولة)", "Rollback + Retry"],
          ["9", "WalletService", "CREDIT محفظة المنصة (العمولة)", "Rollback + Retry"],
          ["10", "TicketService", "تغيير حالة التذكرة → PAID", "Rollback + Retry"],
          ["11", "IdempotencyService", "تسجيل payment_id كـ COMPLETED", "Rollback + Retry"],
          ["12", "OutboxService", "إضافة مهام الإشعارات للـ Outbox", "Rollback + Retry"],
          ["13", "AuditService", "تسجيل العملية في AuditLog", "Non-blocking"],
          ["14", "DB Commit", "تثبيت كل التغييرات", "Rollback"],
          ["15", "WebhookController", "الرد بـ 200 OK لـ Paymob", ""],
        ],
        [700, 2000, 4200, 2460]
      ),
      spacer(200),

      h2("5.2 Webhook Controller — الكود الرئيسي"),
      ...codeBlock([
        "// src/api/payment/controllers/webhook.ts",
        "export default {",
        "  async handlePaymob(ctx: Context) {",
        "    const body = ctx.request.body;",
        "    const hmac = ctx.query.hmac as string;",
        "",
        "    // ── أمان ─────────────────────────────────────────────",
        "    if (!verifyPaymobHMAC(body, hmac, process.env.PAYMOB_HMAC_SECRET)) {",
        "      return ctx.unauthorized('Invalid HMAC signature');",
        "    }",
        "",
        "    // فحص الـ Timestamp — حماية من Replay Attacks",
        "    const webhookAge = Date.now() - new Date(body.created_at).getTime();",
        "    if (webhookAge > 5 * 60 * 1000) {",
        "      return ctx.unauthorized('Webhook too old — possible replay attack');",
        "    }",
        "",
        "    // معالجة حالات النجاح فقط",
        "    if (!body.success) {",
        "      strapi.log.info(`Payment failed: ${body.id} — skipping`);",
        "      return ctx.send({ received: true });",
        "    }",
        "",
        "    // ── Idempotency ──────────────────────────────────────",
        "    const existing = await strapi.service('api::payment.idempotency')",
        "      .findByKey(body.id);",
        "",
        "    if (existing?.status === 'COMPLETED') {",
        "      return ctx.send(existing.result_payload); // الرد المحفوظ",
        "    }",
        "",
        "    if (existing?.status === 'PROCESSING') {",
        "      return ctx.send({ status: 'processing' }); // تجنب التوازي",
        "    }",
        "",
        "    // ── Unit of Work ─────────────────────────────────────",
        "    try {",
        "      await strapi.db.transaction(async (trx) => {",
        "        await strapi.service('api::payment.idempotency')",
        "          .markProcessing(body.id, trx);",
        "",
        "        await strapi.service('api::payment.payment')",
        "          .processSuccessfulPayment(body, trx);",
        "      });",
        "",
        "      ctx.send({ status: 'ok' });",
        "    } catch (error) {",
        "      strapi.log.error('Webhook processing failed', { error, paymentId: body.id });",
        "      // إرسال 500 — يجبر Paymob على الـ Retry",
        "      ctx.internal"""

# Write to a .md file
file_name = "wallet-payment-system-design.md"
with open(file_name, "w", encoding="utf-8") as f:
    f.write(content)

print(f"File '{file_name}' has been created.")