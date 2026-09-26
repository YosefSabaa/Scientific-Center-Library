import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as string) || 'payment-receipts';

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl, path: data.path });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}