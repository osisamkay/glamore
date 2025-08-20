import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status');
  const sortBy = searchParams.get('sortBy') || 'date_desc';
  const type = searchParams.get('type') || 'regular';

  const [sortField, sortOrder] = sortBy.split('_');

  const whereClause = {
    AND: [],
  };

  if (search) {
    whereClause.AND.push({
      OR: [
        { id: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (status && status !== 'Any Status') {
    whereClause.AND.push({ status: status });
  }

  if (type === 'tailored') {
    whereClause.AND.push({
      items: {
        some: {
          customMeasurements: { not: null },
        },
      },
    });
  } else {
    whereClause.AND.push({
      items: {
        every: {
          customMeasurements: null,
        },
      },
    });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    let ordersResult;
    const orderByField = sortField === 'date' ? '"createdAt"' : 'total';
    const orderDirection = sortOrder.toUpperCase();
    
    if (search && status && status !== 'Any Status') {
      if (orderByField === '"createdAt"' && orderDirection === 'DESC') {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE (id ILIKE ${`%${search}%`} OR "firstName" ILIKE ${`%${search}%`} OR "lastName" ILIKE ${`%${search}%`}) 
          AND status = ${status}
          ORDER BY "createdAt" DESC
        `;
      } else if (orderByField === '"createdAt"' && orderDirection === 'ASC') {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE (id ILIKE ${`%${search}%`} OR "firstName" ILIKE ${`%${search}%`} OR "lastName" ILIKE ${`%${search}%`}) 
          AND status = ${status}
          ORDER BY "createdAt" ASC
        `;
      } else if (orderByField === 'total' && orderDirection === 'DESC') {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE (id ILIKE ${`%${search}%`} OR "firstName" ILIKE ${`%${search}%`} OR "lastName" ILIKE ${`%${search}%`}) 
          AND status = ${status}
          ORDER BY total DESC
        `;
      } else {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE (id ILIKE ${`%${search}%`} OR "firstName" ILIKE ${`%${search}%`} OR "lastName" ILIKE ${`%${search}%`}) 
          AND status = ${status}
          ORDER BY total ASC
        `;
      }
    } else if (search) {
      if (orderByField === '"createdAt"' && orderDirection === 'DESC') {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE id ILIKE ${`%${search}%`} OR "firstName" ILIKE ${`%${search}%`} OR "lastName" ILIKE ${`%${search}%`}
          ORDER BY "createdAt" DESC
        `;
      } else if (orderByField === '"createdAt"' && orderDirection === 'ASC') {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE id ILIKE ${`%${search}%`} OR "firstName" ILIKE ${`%${search}%`} OR "lastName" ILIKE ${`%${search}%`}
          ORDER BY "createdAt" ASC
        `;
      } else if (orderByField === 'total' && orderDirection === 'DESC') {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE id ILIKE ${`%${search}%`} OR "firstName" ILIKE ${`%${search}%`} OR "lastName" ILIKE ${`%${search}%`}
          ORDER BY total DESC
        `;
      } else {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE id ILIKE ${`%${search}%`} OR "firstName" ILIKE ${`%${search}%`} OR "lastName" ILIKE ${`%${search}%`}
          ORDER BY total ASC
        `;
      }
    } else if (status && status !== 'Any Status') {
      if (orderByField === '"createdAt"' && orderDirection === 'DESC') {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE status = ${status}
          ORDER BY "createdAt" DESC
        `;
      } else if (orderByField === '"createdAt"' && orderDirection === 'ASC') {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE status = ${status}
          ORDER BY "createdAt" ASC
        `;
      } else if (orderByField === 'total' && orderDirection === 'DESC') {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE status = ${status}
          ORDER BY total DESC
        `;
      } else {
        ordersResult = await sql`
          SELECT * FROM "Order" 
          WHERE status = ${status}
          ORDER BY total ASC
        `;
      }
    } else {
      if (orderByField === '"createdAt"' && orderDirection === 'DESC') {
        ordersResult = await sql`SELECT * FROM "Order" ORDER BY "createdAt" DESC`;
      } else if (orderByField === '"createdAt"' && orderDirection === 'ASC') {
        ordersResult = await sql`SELECT * FROM "Order" ORDER BY "createdAt" ASC`;
      } else if (orderByField === 'total' && orderDirection === 'DESC') {
        ordersResult = await sql`SELECT * FROM "Order" ORDER BY total DESC`;
      } else {
        ordersResult = await sql`SELECT * FROM "Order" ORDER BY total ASC`;
      }
    }
    
    // Get items for each order
    const orders = [];
    for (const order of ordersResult) {
      const items = await sql`SELECT * FROM "OrderItem" WHERE "orderId" = ${order.id}`;
      orders.push({ ...order, items });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
